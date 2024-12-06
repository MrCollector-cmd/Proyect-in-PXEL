import { controlls } from "../controlls/controlls.js";
import { size } from "../../configs/size.js";
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
    constructor(x, y, width, height, img, type, repeatTexture) {
        super(x, y, width, height, );
        this.type = type;
        this.repeatTexture = repeatTexture;
        this.img = new Image();
        this.img.src = img;
        this.direction = null;
    }
    draw(context, offsetX, offsetY) {
        if (this.img.complete && this.img.width !== 0) {
            const adjustedX = this.x - offsetX;
            const adjustedY = this.y - offsetY;
    
            if (this.repeatTexture) {
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
        this.isJumping = false;  // Indica si el jugador está saltando
        this.jumpHeight = 0;     // Altura del salto
        this.pCollTop = false;   // Colisión superior
        this.pCollButton = false; // Colisión con el suelo
        this.pCollRight = false;  // Colisión con la derecha
        this.pCollLeft = false;   // Colisión con la izquierda
        this.mapObjects = [];     // Objetos con los que el jugador puede chocar
        this.velocityY = 0;        // Velocidad vertical
        this.canJump = true;       // Indica si puede saltar (debe soltar la tecla primero)
        this.direction = false;
    }
    move(){
        this.refreshColl()
        const speed = 12; // Velocidad de movimiento horizontal
        const jumpForce = -25; // Fuerza del salto
        const gravity = 1.7; // Aceleración de la gravedad
        const maxFallSpeed = 20; // Velocidad máxima de caída
        // Manejar salto
        if (controlls.up) {
            if (this.pCollButton && this.canJump) {
                this.velocityY = jumpForce; // Aplicar fuerza de salto a la velocidad vertical
                this.isJumping = true; // Activar el estado de salto
                this.canJump = false; // Desactivar la capacidad de saltar
            }
        } else {
            // Solo permite saltar de nuevo cuando suelta la tecla
            this.canJump = true;
        }
    
        // Aplicar gravedad
        if (!this.pCollButton) {
            this.velocityY += gravity; // Aplicar gravedad a la velocidad vertical
            if (this.velocityY > maxFallSpeed) {
                this.velocityY = maxFallSpeed; // Limitar la velocidad de caída
            }
        }
        // Movimiento horizontal
        let moveX = 0;
        if (controlls.left && !this.pCollLeft){
             moveX -= speed;
        }   // Mueve hacia la izquierda si se presiona la tecla izquierda y no hay colisión con la izquierda
        if (controlls.right && !this.pCollRight){
             moveX += speed;
            } // Mueve hacia la derecha si se presiona la tecla derecha y no hay colisión con la derecha
        if(controlls.right){
            this.direction = false;
        }else if(controlls.left){
            this.direction = true;
        }
        // Aplicar movimiento horizontal
        let newX = this.x + moveX;           // Actualiza la posición horizontal
        let newY = this.y + this.velocityY;  // Actualiza la posición vertical
    
        // Verificar colisiones
        let isOnGround = false;
        for (let obj of this.mapObjects) {     // Itera sobre los objetos del mapa
            if (obj.type === 'solid') {
                
                // Verifica si hay colisión en Y
                if (this.willCollide(this.x, newY, obj)) {
                    if (this.velocityY > 0) {   // Cayendo
                        newY = obj.y - this.height;  // Actualiza la posición vertical para evitar caer dentro del objeto
                        this.velocityY = 0;
                        this.pCollButton = true;
                        isOnGround = true;
                        this.isJumping = false;
                    } else if (this.velocityY < 0) {    // Subiendo
                        newY = obj.y + obj.height;      
                        this.velocityY = 0;
                        this.pCollTop = true;
                    }
                }

    
                // Verificar colisión en X
                if (this.willCollide(newX, this.y, obj)) {
                    if (moveX > 0) {  
                        newX = obj.x - this.width;
                        this.pCollRight = true;
                    } else if (moveX < 0) {
                        newX = obj.x + obj.width;
                        this.pCollLeft = true;
                    }
                }
            }
        }
        
        if (!isOnGround) { // Si no está en el suelo
            this.pCollButton = false; // Desactiva la colisión con el suelo
        }
    
        // Actualizar posición del jugador y del div
        this.x = newX; 
        this.y = newY; 
    
    }
    willCollide(x, y, obj) {
        return (
            x < obj.x + obj.width &&            // Verifica si el jugador está a la izquierda del objeto
            x + this.width > obj.x &&    // Verifica si el jugador está a la derecha del objeto
            y < obj.y + obj.height &&           // Verifica si el jugador está arriba del objeto
            y + this.height > obj.y      // Verifica si el jugador está abajo del objeto
        );
    };
    refreshColl () {
        this.pCollTop = false; 
        this.pCollLeft = false;
        this.pCollRight = false;
    };
    draw(context, offsetX, offsetY) {
        // Dibuja la imagen del personaje
        super.draw(context, offsetX, offsetY);
    
        // Coordenadas del centro del personaje
        const centerX = this.x + this.width / 2 - offsetX;
        const centerY = this.y + this.height / 2 - offsetY;
    
        // Radio del círculo de luz
        const lightRadius = 150;
    
        // Crear un gradiente radial para el efecto de luz
        const gradient = context.createRadialGradient(
            centerX, centerY, 0,       // Centro del círculo, radio interior
            centerX, centerY, lightRadius // Centro del círculo, radio exterior
        );
    
        // Definir los colores del gradiente
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)'); // Blanco semitransparente en el centro
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   // Transparente en los bordes
    
        // Dibujar el círculo con el gradiente
        context.beginPath();
        context.arc(centerX, centerY, lightRadius, 0, Math.PI * 2); // Círculo completo
        context.fillStyle = gradient;
        context.fill();
    }
    
}



export {Rect, Entity,Criature}