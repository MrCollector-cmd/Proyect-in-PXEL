import { Criature } from "../rect.js";
import { contextThisGame } from "../context.js";

class BasicEnemy extends Criature {
    //BasicEnemy es un enemigo que se mueve en una dirección y salta cada 5 segundos si está en el suelo
    constructor(x, y, width, height, img, type, stats) {
        super(x, y, width, height, img, type, stats);
        this.initializeProperties();
    }

    initializeProperties() {
        this.lastJumpTime = Date.now();//tiempo en el que se saltó por ultima vez
        this.pCollButton = true;//si esta en el suelo
        this.isJumping = false;//si esta saltando
        this.view = false
        this.velocityY = 0;//velocidad en el eje y
        this.velocityX = 0;//velocidad en el eje x
        this.moveSpeed = 5;//velocidad de movimiento
        this.direction = 1;//direccion de movimiento
        this.GRAVITY = 1.5;//gravedad
        this.MAX_FALL_SPEED = 20;//velocidad maxima de caida
        this.JUMP_FORCE = -8;//fuerza del salto
        this.JUMP_INTERVAL = 1000;//intervalo de tiempo entre saltos
        this.FRICTION = 0.4;//friccion
    }

    //aplica la gravedad al enemigo
    applyGravity() {
        if (!this.pCollButton) {
            this.velocityY += this.GRAVITY; //aumenta la velocidad en el eje y
            this.velocityY = Math.min(this.velocityY, this.MAX_FALL_SPEED); //limita la velocidad en el eje y
        }
    }

    //aplica la friccion al enemigo
    applyFriction() {
        if (this.velocityX > 0) {
            this.velocityX = Math.max(0, this.velocityX - this.FRICTION);   //si la velocidad en el eje x es mayor que 0, disminuye la velocidad en el eje x
        } else if (this.velocityX < 0) {
            this.velocityX = Math.min(0, this.velocityX + this.FRICTION);   //si la velocidad en el eje x es menor que 0, aumenta la velocidad en el eje x
        }
    }

    //maneja las colisiones del enemigo
    handleCollisions(visibleEntities, newX, newY) {
        this.pCollButton = this.pCollLeft = this.pCollRight = false; //resetea las colisiones

        for (let entity of visibleEntities) {
            if (entity.type !== 'solid') continue;

            //si el enemigo colisiona con una pared vertical, se detiene y se mueve hacia la otra pared
            if (this.checkVerticalCollision(entity, newX, newY)) {
                newY = entity.y - this.height;
                this.velocityY = 0;
                this.pCollButton = true;
                this.isJumping = false;
            }

            if (this.checkLateralCollision(entity, newX, newY)) {
                if (this.x + this.width <= entity.x) {
                    newX = entity.x - this.width;
                    this.pCollRight = true;
                } else {
                    newX = entity.x + entity.width;
                    this.pCollLeft = true;
                }
                this.velocityX = 0;
                this.direction *= -1;
            }
        }

        return { newX, newY };
    }

    //verifica si el enemigo colisiona con una pared vertical
    checkVerticalCollision(entity, newX, newY) {
        return this.velocityY > 0 &&
               this.x + this.width > entity.x && 
               this.x < entity.x + entity.width &&
               newY + this.height > entity.y && 
               this.y + this.height <= entity.y;
    }

    //verifica si el enemigo colisiona con una pared lateral
    checkLateralCollision(entity, newX, newY) {
        return newY + this.height > entity.y &&
               newY < entity.y + entity.height &&
               ((this.x + this.width <= entity.x && newX + this.width > entity.x) ||
                (this.x >= entity.x + entity.width && newX < entity.x + entity.width));
    }

    //maneja el salto del enemigo
    handleJump(currentTime) {
        if (currentTime - this.lastJumpTime >= this.JUMP_INTERVAL && this.pCollButton) {
            this.velocityY = this.JUMP_FORCE;
            this.velocityX = this.moveSpeed * this.direction;
            this.lastJumpTime = currentTime;
            this.isJumping = true;
            this.pCollButton = false;
        }
    }

    //actualiza la posición del enemigo
    update(visibleEntities) {
        const currentTime = Date.now();
        
        if(this.view === true){
            this.applyGravity(); //aplica la gravedad al enemie
        }
        let newPosition = this.handleCollisions(
            visibleEntities,
            this.x + this.velocityX,
            this.y + this.velocityY
        );

        this.x = newPosition.newX;
        this.y = newPosition.newY;

        this.applyFriction(); //aplica la friccion al enemigo
        this.handleJump(currentTime); //maneja el salto del enemigo
        this.checkPlayerCollision(); //verifica si el enemigo colisiona con el jugador
    }

    //verifica si el enemigo colisiona con el jugador
    checkPlayerCollision() {
        if (!contextThisGame.player) return; //si no hay jugador, no se ejecuta
        const player = contextThisGame.player;
        
        //si el jugador colisiona con el enemigo, se mueve el jugador hacia la otra pared
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            
            const overlapLeft = this.x + this.width - player.x;
            const overlapRight = player.x + player.width - this.x;
            const overlapTop = this.y + this.height - player.y;
            const overlapBottom = player.y + player.height - this.y;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft) {
                player.x = this.x + this.width;
                player.pCollLeft = true;
            } else if (minOverlap === overlapRight) {
                player.x = this.x - player.width;
                player.pCollRight = true;
            } else if (minOverlap === overlapTop) {
                player.y = this.y + this.height;
                player.pCollTop = true;
            } else if (minOverlap === overlapBottom) {
                player.y = this.y - player.height;
                player.pCollButton = true;
            }
            
            //si el jugador tiene vida, le resta vida al jugador
            if (player.stats && player.stats.heal > 0) {
                player.stats.heal -= this.stats.damage;
                console.log(`Jugador dañado! Vida restante: ${player.stats.heal}`);
            }
        }
    }

    //dibuja el enemigo
    draw(context, offsetX, offsetY) {
        super.draw(context,offsetX,offsetY)
    }
}

export { BasicEnemy };
