import { controlls } from "../controlls/controlls.js";
import { size } from "../../configs/size.js";
import { imagesController } from "../../configs/imagesController.js";
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    checkCollision = function(rect) {
        // Verificar si hay solapamiento en el eje X e Y
        let collisionX = this.x < rect.x + rect.width && this.x + this.width > rect.x;
        let collisionY = this.y < rect.y + rect.height && this.y + this.height > rect.y;
    
        if (collisionX && collisionY) {
            // Determinar el lado de la colisión
            let overlapLeft = rect.x + rect.width - this.x;
            let overlapRight = this.x + this.width - rect.x;
            let overlapTop = rect.y + rect.height - this.y;
            let overlapBottom = this.y + this.height - rect.y;
            let collisions = [];
            // Comparar las superposiciones para determinar la dirección de la colisión
            let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
            if (minOverlap === overlapLeft) {
                collisions.push('left') ;  // Colisión por la izquierda
            }
            if (minOverlap === overlapRight) {
                collisions.push('right'); // Colisión por la derecha
            }
            if (minOverlap === overlapTop) {
                collisions.push('top') ;   // Colisión por arriba
            }
            if (minOverlap === overlapBottom) {
                collisions.push('bottom'); // Colisión por abajo
            }
            return collisions
        }
        
        return null; // No hay colisión
    };
}
class Entity extends Rect {
    constructor(x, y, width, height, img, type, repeatTexture, id, opacity, light) {
        super(x, y, width, height);
        this.id = id;
        this.type = type;
        this.opacity = opacity;
        this.repeatTexture = repeatTexture;
        this.light = light;
        // Usamos imagesController para cargar la imagen desde el caché
        this.img = imagesController.loadImage(img); // Aquí se carga la imagen desde el caché
        this.direction = null;
    }

    draw(context, offsetX, offsetY, colorLayer = null) {
        if (this.img.complete && this.img.width !== 0) {
            const adjustedX = this.x - offsetX;
            const adjustedY = this.y - offsetY;
    
            // Verificar visibilidad antes de dibujar
            const canvasWidth = context.canvas.width;
            const canvasHeight = context.canvas.height;
            if (
                adjustedX + this.width < 0 || adjustedX > canvasWidth ||
                adjustedY + this.height < 0 || adjustedY > canvasHeight
            ) {
                return; // No dibujar si está fuera del área visible
            }

            // Aplicar opacidad si está definida
            const originalAlpha = context.globalAlpha; // Guardar la opacidad actual
            if (this.opacity !== undefined) {
                context.globalAlpha = this.opacity;
            }

            if (this.repeatTexture) {
                // Modo de repetición de textura en tiles
                const tilesX = Math.ceil(this.width / size.tils); // Número de tiles en X
                const tilesY = Math.ceil(this.height / size.tils); // Número de tiles en Y
    
                for (let i = 0; i < tilesX; i++) {
                    for (let j = 0; j < tilesY; j++) {
                        // Coordenadas del tile actual
                        const tileX = adjustedX + i * size.tils;
                        const tileY = adjustedY + j * size.tils;
    
                        // Calcular dimensiones del tile para manejar bordes
                        const tileWidth = Math.min(size.tils, this.width - i * size.tils);
                        const tileHeight = Math.min(size.tils, this.height - j * size.tils);
    
                        // Dibujar el tile ajustando los bordes si es necesario
                        context.drawImage(
                            this.img,
                            0, 0, this.img.width, this.img.height, // Fuente completa
                            tileX, tileY,                        // Coordenadas del tile
                            tileWidth, tileHeight                // Dimensiones del tile
                        );
                    }
                }
            } else {
                // Si direction es true, voltear la imagen en X
                if (this.direction) {
                    context.save(); // Guardar el estado actual del contexto
    
                    // Ajustar la escala en el eje X
                    context.scale(-1, 1);
    
                    // Ajustar la posición X para reflejar la imagen correctamente
                    const flippedX = -(adjustedX + this.width);
    
                    // Dibujar la imagen reflejada en el eje X
                    context.drawImage(
                        this.img,
                        0, 0, this.img.width, this.img.height, // Fuente completa
                        flippedX, adjustedY,                   // Coordenadas destino
                        this.width, this.height               // Tamaño destino
                    );
    
                    context.restore(); // Restaurar el estado original del contexto
                } else {
                    // Dibujar la imagen sin voltear si direction es false
                    context.drawImage(
                        this.img,
                        0, 0, this.img.width, this.img.height, // Fuente completa
                        adjustedX, adjustedY,                 // Coordenadas destino
                        this.width, this.height               // Tamaño destino
                    );
                }
            }

            // Si light es true, dibujar el aro de luz después de la imagen
            if (this.light) {
                context.save(); // Guardar el estado actual

                // Crear un gradiente radial para el efecto de luz
                const centerX = this.x + this.width / 2 - offsetX;
                const centerY = this.y + this.height / 2 - offsetY;
                const lightRadius = 300;
    
                const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
                gradient.addColorStop(0, 'rgba(96, 112, 250, 0.2)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
                context.beginPath();
                context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
                context.fillStyle = gradient;
                context.fill();
    
                context.restore(); // Restaurar el estado original
            }

            // Restaurar la opacidad original
            context.globalAlpha = originalAlpha;
        }
    }
}


class Criature extends Entity {
    constructor(x, y, width, height, img, type, stats) {
        super(x, y, width, height, img, type);
        this.stats = stats;
        this.isJumping = false;
        this.jumpHeight = 0;
        this.pCollTop = false;
        this.pCollButton = false;
        this.pCollRight = false;
        this.pCollLeft = false;
        this.velocityY = 0;
        this.canJump = true;
        this.remainingJumps = 2;
        this.dash = false;
        this.velocityX = 0;
        this.currentDashDistance = 0;
        this.direction = false;
        this.isDashing = false;
        this.doubleJumpAvailable = true;
        this.animations={
            idle:true
        }
        this.rotation = 0;  // Ángulo de rotación en grados
    }

    move(mapObjects) {
        this.refreshColl();
        const speed = 10;
        const jumpForce = -25;
        const gravity = 1.5;
        const maxFallSpeed = 20;
        const speedDash = 40;
        const dashDistance = 200;
    

        this.handleJump(jumpForce, gravity, maxFallSpeed);
        this.handleMovement(speed, mapObjects);
        // this.handleRotation();  // Llamar al método de rotación
        this.handleDash(speedDash, dashDistance);
        this.applyMovement();
        this.checkCollisions(mapObjects);
        this.updatePosition();
    }
    handleJump(jumpForce, gravity, maxFallSpeed) {
        if (controlls.up && this.remainingJumps > 0 && this.canJump) {
            // Realizar el salto si se cumple la condición de que el jugador puede saltar
            this.velocityY = jumpForce;
            this.isJumping = true;
            this.canJump = false;
            this.remainingJumps--;
        } else if (!controlls.up) {
            // Si no se está presionando la tecla de salto, el jugador puede saltar nuevamente
            this.canJump = true;
        }
    
        // Si el jugador está en el suelo (colisiona por abajo), se reinician los saltos restantes
        if (this.pCollButton) {
            if (this.remainingJumps === 0) {
                this.remainingJumps = 2;  // O el número de saltos permitidos
            }
            this.isJumping = false; // El salto ha terminado si el jugador está en el suelo
        }
    
        // Si el jugador no está en el suelo, la gravedad debe actuar
        if (!this.pCollButton) {
            this.velocityY += gravity;
            if (this.velocityY > maxFallSpeed) {
                this.velocityY = maxFallSpeed;  // Limitar la velocidad máxima de caída
            }
        }
    }
    
    handleMovement(speed, mapObjects) {
        let moveX = 0;
        if (controlls.left && !this.pCollLeft) moveX -= speed;
        if (controlls.right && !this.pCollRight) moveX += speed;
    
        // Actualizamos la dirección del personaje dependiendo de la entrada
        if (controlls.right) {
            this.direction = false;
        } else if (controlls.left) {
            this.direction = true;
        }
    
        // Comprobar colisión antes de actualizar el movimiento horizontal
        if (this.willCollide(this.x + moveX, this.y, mapObjects)) {
            if (moveX > 0) {
                this.pCollRight = true;
                moveX = 0;  // Detener el movimiento horizontal si hay colisión a la derecha
            } else if (moveX < 0) {
                this.pCollLeft = true;
                moveX = 0;  // Detener el movimiento horizontal si hay colisión a la izquierda
            }
        }
    
        this.moveX = moveX;
    }
    
    handleDash(speedDash, dashDistance) {
        if (controlls.dash && !this.dash && !this.isDashing) {
            this.dash = true;
            this.isDashing = true;
            this.velocityX = this.direction ? -speedDash : speedDash;
            this.currentDashDistance = 0;
        }
    
        if (this.dash) {
            const dashStep = this.velocityX;
            this.currentDashDistance += Math.abs(dashStep);
            if (this.currentDashDistance >= dashDistance) {
                this.dash = false;
                this.velocityX = 0;
            } else {
                this.moveX = dashStep;
            }
        } else {
            if (!controlls.dash) {
                this.isDashing = false;
            }
        }
    }
    
    applyMovement() {
        this.newX = this.x + this.moveX;
        this.newY = this.y + this.velocityY;
    }
    
    checkCollisions(mapObjects) {
        let isOnGround = false;
    
        for (let obj of mapObjects) {
            if (obj.type === 'solid') {
                if (this.willCollide(this.x, this.newY, obj)) {
                    if (this.velocityY > 0) {
                        // Evitar que el personaje atraviese el suelo
                        this.velocityY = 0;
                        this.pCollButton = true;
                        isOnGround = true;
                        this.newY = obj.y - this.height;
                    } else if (this.velocityY < 0) {
                        this.newY = obj.y + obj.height;
                        this.velocityY = 0;
                        this.pCollTop = true;
                    }
                }
    
                if (this.willCollide(this.newX, this.y, obj)) {
                    if (this.moveX > 0) {
                        this.newX = obj.x - this.width;  // Ajustar posición para no atravesar el objeto
                        this.pCollRight = true;
                    } else if (this.moveX < 0) {
                        this.newX = obj.x + obj.width;  // Ajustar posición para no atravesar el objeto
                        this.pCollLeft = true;
                    }
                }
            }
        }
    
        if (!isOnGround) {
            this.pCollButton = false;
        }
    }
    
    updatePosition() {
        this.x = this.newX;
        this.y = this.newY;
    }
    
    willCollide(x, y, obj) {
        return (
            x < obj.x + obj.width &&
            x + this.width > obj.x &&
            y < obj.y + obj.height &&
            y + this.height > obj.y
        );
    }
    
    refreshColl() {
        this.pCollTop = false;
        this.pCollLeft = false;
        this.pCollRight = false;
    }
    draw(context, offsetX, offsetY) {
        if (this.img.complete && this.img.width !== 0) {
            const adjustedX = this.x - offsetX;
            const adjustedY = this.y - offsetY;
    
            // Verificar visibilidad antes de dibujar
            const canvasWidth = context.canvas.width;
            const canvasHeight = context.canvas.height;
            if (
                adjustedX + this.width < 0 || adjustedX > canvasWidth ||
                adjustedY + this.height < 0 || adjustedY > canvasHeight
            ) {
                return; // No dibujar si está fuera del área visible
            }
    
            // Aplicar opacidad si está definida
            const originalAlpha = context.globalAlpha; // Guardar la opacidad actual
            if (this.opacity !== undefined) {
                context.globalAlpha = this.opacity;
            }
    
            // Aplicar rotación si se necesita
            if (this.rotation !== 0) {
                const centerX = adjustedX + this.width / 2;
                const centerY = adjustedY + this.height / 2;
    
                // Guardar el estado del contexto
                context.save();
    
                // Trasladar al centro de la imagen para rotar alrededor de su centro
                context.translate(centerX, centerY);
    
                // Aplicar la rotación
                context.rotate(this.rotation * Math.PI / 180);
    
                // Trasladar de nuevo a la posición original
                context.translate(-centerX, -centerY);
            }
    
            // Si direction es true, voltear la imagen en X
            if (this.direction) {
                context.save(); // Guardar el estado actual del contexto
    
                // Ajustar la escala en el eje X
                context.scale(-1, 1);
    
                // Ajustar la posición X para reflejar la imagen correctamente
                const flippedX = -(adjustedX + this.width);
    
                // Dibujar la imagen reflejada en el eje X
                context.drawImage(
                    this.img,
                    0, 0, this.img.width, this.img.height, // Fuente completa
                    flippedX, adjustedY,                   // Coordenadas destino
                    this.width, this.height               // Tamaño destino
                );
    
                context.restore(); // Restaurar el estado original del contexto
            } else {
                // Dibujar la imagen sin voltear si direction es false
                context.drawImage(
                    this.img,
                    0, 0, this.img.width, this.img.height, // Fuente completa
                    adjustedX, adjustedY,                 // Coordenadas destino
                    this.width, this.height               // Tamaño destino
                );
            }
    
            // Restaurar la opacidad original
            context.globalAlpha = originalAlpha;
    
            // Restaurar el estado del contexto después de la rotación
            if (this.rotation !== 0) {
                context.restore();
            }
        }
        // Crea un aro de luz
        const centerX = this.x + this.width / 2 - offsetX;
        const centerY = this.y + this.height / 2 - offsetY;
        const lightRadius = 250;
    
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
        context.beginPath();
        context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
    }
}




export {Rect, Entity,Criature}