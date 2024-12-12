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
        constructor(x, y, width, height, img, type, repeatTexture, id) {
            super(x, y, width, height);
            this.id = id;
            this.type = type;
            this.repeatTexture = repeatTexture;
            // Usamos imagesController para cargar la imagen desde el caché
            this.img = imagesController.loadImage(img); // Aquí se carga la imagen desde el caché
            this.direction = null;
        }
    
    draw(context, offsetX, offsetY) {
        if (this.img.complete && this.img.width !== 0) {
            const adjustedX = this.x - offsetX;
            const adjustedY = this.y - offsetY;

            if (this.repeatTexture === true) {
                
                // Dibujar la imagen repetida en tiles
                const tilesX = Math.ceil(this.width / size.tils); // Cantidad de tiles en X
                const tilesY = Math.ceil(this.height / size.tils); // Cantidad de tiles en Y
                
                for (let i = 0; i < tilesX; i++) {
                    for (let j = 0; j < tilesY; j++) {
                        context.drawImage(
                            this.img,
                            adjustedX + i * size.tils, // Posición X del tile
                            adjustedY + j * size.tils, // Posición Y del tile
                            size.tils,                 // Ancho del tile
                            size.tils                  // Alto del tile
                        );
                        
                    }
                }
                // // Configuración del estilo del contorno
                // context.strokeStyle = 'red'; // Color del contorno
                // context.lineWidth = 3; // Grosor del contorno

                // // Dibuja el contorno del rectángulo
                // context.strokeRect(adjustedX, adjustedY, this.width, this.height);
            }
            else {
                if (this.direction !== null) {
                    // Dibuja la imagen según la dirección
                    context.save(); // Guarda el estado del contexto
                
                    if (this.direction) {
                        // Reflejar horizontalmente
                        context.translate(adjustedX + this.width, adjustedY); // Ajusta la posición destino
                        context.scale(-1, 1); // Escala horizontalmente
                    } else {
                        // Dirección 'right' o por defecto: sin reflejo
                        context.translate(adjustedX, adjustedY);
                    }
                
                    // Dibujar la imagen
                    context.drawImage(
                        this.img,
                        0, 0, this.img.width, this.img.height, // Fuente: toda la imagen
                        0, 0, this.width, this.height          // Dibuja en el destino con el tamaño ajustado
                    );
                
                    context.restore(); // Restaura el contexto
                }else{
                    // Dibujar la imagen ajustada al tamaño del objeto (sin repetir)
                    context.drawImage(
                    this.img,
                    0, 0, this.img.width, this.img.height, // Fuente: toda la imagen
                    adjustedX, adjustedY,                 // Posición destino
                    this.width, this.height               // Tamaño destino
                );
                }
                
            }
            
        } else {
            
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
        this.handleMovement(speed);
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
            // Solo reiniciar los saltos si no está ya en el suelo
            if (this.remainingJumps === 0) {
                this.remainingJumps = 2;  // O el número de saltos permitidos
            }
        }
    
        // Si el jugador no está en el suelo, la gravedad debe actuar
        if (!this.pCollButton) {
            this.velocityY += gravity;
            if (this.velocityY > maxFallSpeed) {
                this.velocityY = maxFallSpeed;  // Limitar la velocidad máxima de caída
            }
        }
    }

    handleMovement(speed) {
        let moveX = 0;
        if (controlls.left && !this.pCollLeft) moveX -= speed;
        if (controlls.right && !this.pCollRight) moveX += speed;
        
        // Actualizar la dirección del personaje dependiendo de la entrada
        if (controlls.right) {
            this.direction = false;
        } else if (controlls.left) {
            this.direction = true;
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
                        this.newY = obj.y - this.height;
                        this.velocityY = 0;
                        this.pCollButton = true;
                        isOnGround = true;
                        this.isJumping = false;
                    } else if (this.velocityY < 0) {
                        this.newY = obj.y + obj.height;
                        this.velocityY = 0;
                        this.pCollTop = true;
                    }
                }

                if (this.willCollide(this.newX, this.y, obj)) {
                    if (this.moveX > 0) {
                        this.newX = obj.x - this.width;
                        this.pCollRight = true;
                    } else if (this.moveX < 0) {
                        this.newX = obj.x + obj.width;
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
        super.draw(context, offsetX, offsetY);
        /// Crea un aro de luz
        const centerX = this.x + this.width / 2 - offsetX;
        const centerY = this.y + this.height / 2 - offsetY;
        const lightRadius = 200;

        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, lightRadius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.beginPath();
        context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
        ///////////////////
    }
}




export {Rect, Entity,Criature}