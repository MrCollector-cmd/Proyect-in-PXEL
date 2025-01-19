import { controlls } from "../controlls/controlls.js";
import { size } from "../../configs/size.js";
import { imagesController } from "../../configs/imagesController.js";
import { contextThisGame } from "./context.js";
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
        this.img = img ? imagesController.loadImage(img) : null; // Cargar imagen si se proporciona
        this.direction = null;
    }

    draw(context, offsetX, offsetY) {
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

        if (this.img && this.img.complete && this.img.width !== 0) {
            if (this.repeatTexture) {
                // Modo de repetición de textura en tiles
                const tilesX = Math.ceil(this.width / size.tils); // Número de tiles en X
                const tilesY = Math.ceil(this.height / size.tils); // Número de tiles en Y

                for (let i = 0; i < tilesX; i++) {
                    for (let j = 0; j < tilesY; j++) {
                        const tileX = adjustedX + i * size.tils;
                        const tileY = adjustedY + j * size.tils;

                        const tileWidth = Math.min(size.tils, this.width - i * size.tils);
                        const tileHeight = Math.min(size.tils, this.height - j * size.tils);

                        context.drawImage(
                            this.img,
                            0, 0, this.img.width, this.img.height, // Fuente completa
                            tileX, tileY,                        // Coordenadas del tile
                            tileWidth, tileHeight                // Dimensiones del tile
                        );
                    }
                }
            } else {
                if (this.direction) {
                    context.save();
                    context.scale(-1, 1);
                    const flippedX = -(adjustedX + this.width);

                    context.drawImage(
                        this.img,
                        0, 0, this.img.width, this.img.height, // Fuente completa
                        flippedX, adjustedY,                   // Coordenadas destino
                        this.width, this.height               // Tamaño destino
                    );

                    context.restore();
                } else {
                    context.drawImage(
                        this.img,
                        0, 0, this.img.width, this.img.height, // Fuente completa
                        adjustedX, adjustedY,                 // Coordenadas destino
                        this.width, this.height               // Tamaño destino
                    );
                }
            }
        } else {
            // Dibujar un rectángulo negro si no hay imagen
            context.fillStyle = "black";
            context.fillRect(adjustedX, adjustedY, this.width, this.height);
        }

        if (this.light) {
            context.save();
            const centerX = this.x + this.width / 2 - offsetX;
            const centerY = this.y + this.height / 2 - offsetY;
            const lightRadius = 300;

            const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
            gradient.addColorStop(0, 'rgba(96, 112, 250, 0.19)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            context.beginPath();
            context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
            context.fillStyle = gradient;
            context.fill();

            context.restore();
        }else if (this.glowUp) {
            context.save();
            const centerX = this.x + this.width / 2 - offsetX;
            const centerY = this.y + this.height / 2 - offsetY;
            const lightRadius = 200;

            const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
            gradient.addColorStop(0, 'rgba(96, 112, 250, 0.12)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            context.beginPath();
            context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
            context.fillStyle = gradient;
            context.fill();

            context.restore();
        }

        // Restaurar la opacidad original
        context.globalAlpha = originalAlpha;
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
        this.collEnemy = null;
        this.newX = 0
        this.newY = 0
    }

    move(mapObjects) {
        this.refreshColl();
        const speed = 10;
        const jumpForce = -25;
        const gravity = 1.5;
        const maxFallSpeed = 20;
        const speedDash = 40;
        const dashDistance = 200;

        // Impide el movimiento si el personaje no esta bien cargado o si su vida es 0(cero)
        if(this.stats === undefined || this.stats.heal <= 0){
            return
        }
        ////
        this.handleJump(jumpForce, gravity, maxFallSpeed);
        this.handleMovement(speed, mapObjects);
        this.handleDash(speedDash, dashDistance);
        this.applyMovement();
        this.checkCollisions(mapObjects);
        this.interacts(mapObjects);
        this.updatePosition();
        this.updateStats(Date.now())
    }

    interacts(mapObjects) {
        if (controlls.interact) {
            // Recorrer los objetos filtrados
            for (let obj of mapObjects) {
                 if (obj.id === 6) {
                    // Definir las dimensiones del objeto
                    let mapObject = {
                        x: obj.x,
                        y: obj.y,
                        width: obj.width,
                        height: obj.height
                    };
                    // Verificar si las coordenadas del jugador están dentro del área del objeto
                if (
                    this.x < mapObject.x + mapObject.width &&
                    this.x + this.width > mapObject.x &&
                    this.y < mapObject.y + mapObject.height &&
                    this.y + this.height > mapObject.y
                )  {
                    // Se ha detectado una interacción con el objeto de id 6
                    contextThisGame.next = true;
                }
                
                 }
            }
        }
    }

    updateStats(currentTime) {
        const STAMINA_RECOVERY_INTERVAL = 1900; // Intervalo de recuperación en milisegundos (1 segundo)
        const MAX_STAMINA = this.stats.maxStamina; // Valor máximo de stamina
        const MAX_HEAL = this.stats.maxHeal; // Valor máximo de vida
    
        // Inicializar lastStaminaUpdate si no existe
        if (!this.lastStaminaUpdate) {
            this.lastStaminaUpdate = currentTime ;
        }
    
        // Calcular el tiempo transcurrido desde la última actualización
        const elapsedTime =  Date.now() - this.lastStaminaUpdate;
    
        // Verificar si ha pasado el intervalo de recuperación
        if (elapsedTime >= STAMINA_RECOVERY_INTERVAL) {
            // Calcular cuántos intervalos completos han pasado
            const intervalsPassed = Math.floor(elapsedTime / STAMINA_RECOVERY_INTERVAL);
    
            // Incrementar la stamina según los intervalos completos transcurridos
            this.stats.dash = Math.min(this.stats.dash + intervalsPassed, MAX_STAMINA);
    
            // Actualizar lastStaminaUpdate al último intervalo completo
            this.lastStaminaUpdate += intervalsPassed * STAMINA_RECOVERY_INTERVAL;
        }
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
    
        if (this.dash && this.stats.dash > 0 ) {
            const dashStep = this.velocityX;
            this.currentDashDistance += Math.abs(dashStep);
            if (this.currentDashDistance >= dashDistance) {
                this.dash = false;
                this.velocityX = 0;
                if (this.stats.dash >0) {
                    this.stats.dash -= 1
                }
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
        
        // Paso para mover progresivamente
        const stepSize = 10; // Tamaño del paso para el movimiento (puedes ajustar este valor)
        
        for (let obj of mapObjects) {
            if (obj.type === 'solid') {
                // Verificar colisiones en el eje Y
                if (this.willCollide(this.x, this.newY, obj)) {
                    if (this.velocityY > 0) {
                        // Evitar que el personaje atraviese el suelo
                        this.velocityY = 0;
                        this.pCollButton = true;
                        isOnGround = true;
                        this.newY = obj.y - this.height;  // Ajustar la posición en Y
                    } else if (this.velocityY < 0) {
                        this.newY = obj.y + obj.height;
                        this.velocityY = 0;
                        this.pCollTop = true;
                    }
                }
    
                // Verificar colisiones en el eje X
                if (this.willCollide(this.newX, this.y, obj)) {
                    if (this.moveX > 0) {
                        // Colisión por la derecha
                        this.newX = obj.x - this.width;  // Ajustar posición para no atravesar el objeto
                        this.pCollRight = true;
                    } else if (this.moveX < 0) {
                        // Colisión por la izquierda
                        this.newX = obj.x + obj.width;  // Ajustar posición para no atravesar el objeto
                        this.pCollLeft = true;
                    }
                }
    
                // Verificar colisiones sin movimiento (cuando el jugador no se mueve pero está en contacto con el objeto)
                if (this.x >= obj.x && this.x <= obj.x + obj.width &&
                    this.y >= obj.y && this.y <= obj.y + obj.height) {
                    // Si no hay movimiento y se está colisionando, registramos la colisión
                    if (this.moveX === 0 && this.velocityY === 0) {
                        // Caso de colisión sin movimiento
                        this.pCollRight = false;
                        this.pCollLeft = false;
                        this.pCollButton = false;
                        this.pCollTop = false;
    
                        // Dependiendo de la posición relativa, puedes agregar lógica para un empuje en esa situación
                        // Ejemplo: Si el jugador está tocando el objeto en el eje X y Y, aplicar un pequeño empuje
                        if (this.x < obj.x) {  // Colisión en el eje X
                            this.pCollRight = true;
                        } else if (this.x + this.width > obj.x + obj.width) {
                            this.pCollLeft = true;
                        }
                        if (this.y < obj.y) {  // Colisión en el eje Y
                            this.pCollTop = true;
                        } else if (this.y + this.height > obj.y + obj.height) {
                            this.pCollButton = true;
                        }
                    }
                }
            }
    
            // Empujar al personaje cuando colisiona con un enemigo
            if (this.collEnemy !== null) {
                const pushForce = 100; // Fuerza de empuje total
                const steps = Math.ceil(pushForce / stepSize); // Número de pasos que se darán (dependiendo del tamaño del paso)
    
                // Convertir el valor de rad (grados) a radianes
                const radInRadians = this.collEnemy.rad * (Math.PI / 180); // Convertir grados a radianes
                
                // Calcular el desplazamiento en las direcciones X e Y usando el ángulo de colisión
                const pushX = Math.cos(radInRadians) * stepSize; // Desplazamiento en X por paso
                const pushY = Math.sin(radInRadians) * stepSize; // Desplazamiento en Y por paso
                
                let moved = false;
    
                // Realizar el empuje en pasos pequeños
                for (let i = 0; i < steps; i++) {
                    const newPosX = this.newX + pushX;
                    const newPosY = this.newY + pushY;
                    
                    // Verificar si la nueva posición no causa otra colisión en ambos ejes X y Y
                    let collisionInX = this.willCollide(newPosX, this.newY, mapObjects);
                    let collisionInY = this.willCollide(this.newX, newPosY, mapObjects);
                    
                    // Si no hay colisión en X y Y, mover el personaje
                    if (!collisionInX && !collisionInY) {
                        this.newX = newPosX;
                        this.newY = newPosY;
                        moved = true; // Se movió una vez
                    } else {
                        break; // Si hay colisión en cualquiera de los pasos, detenerse
                    }
                }
                this.collEnemy = null; // Restablecer la variable de colisión
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