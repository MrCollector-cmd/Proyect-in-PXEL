

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
    constructor(x, y, width, height, img, type) {
        super(x, y, width, height);
        this.img = new Image();
        this.img.src = img;
        this.type = type;
    }

    draw(context) {
        if (this.img.complete) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            this.img.onload = () => {
                context.drawImage(this.img, this.x, this.y, this.width, this.height);
            };
        }
    }
}

class Being extends Entity {
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
    }

    draw(context) {
        // Dibuja la imagen del personaje
        super.draw(context);

        // Opcional: Dibuja las estadísticas sobre el personaje
        context.fillStyle = 'red';
        context.font = '14px Arial';
        context.fillText(`HP: ${this.stats.heal}`, this.x, this.y - 10);
    }
}



export {Rect, Entity,Being}