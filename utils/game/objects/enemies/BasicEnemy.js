import { Criature } from "../rect.js";
import { contextThisGame } from "../context.js";

class BasicEnemy extends Criature {
    constructor(x, y, width, height, img, type, stats, id) {
        super(x, y, width, height, img, type, stats, id);
        this.initializeProperties();
    }

    initializeProperties() {
        this.lastJumpTime = Date.now();
        this.pCollButton = true;
        this.isJumping = false;
        this.view = false;
        this.velocityY = 0;
        this.velocityX = 0;
        this.moveSpeed = 5;
        this.direction = 1;
        this.GRAVITY = 1.5;
        this.MAX_FALL_SPEED = 20;
        this.JUMP_FORCE = -8;
        this.JUMP_INTERVAL = 1000;
        this.FRICTION = 0.4;
        this.lastAttackTime = 0; // Tiempo del último ataque al jugador
        this.ATTACK_COOLDOWN = 1000; // Cooldown de 1 segundo entre ataques
        
    }

    applyGravity() {
        if (!this.pCollButton) {
            this.velocityY += this.GRAVITY;
            this.velocityY = Math.min(this.velocityY, this.MAX_FALL_SPEED);
        }
    }

    applyFriction() {
        if (this.velocityX > 0) {
            this.velocityX = Math.max(0, this.velocityX - this.FRICTION);
        } else if (this.velocityX < 0) {
            this.velocityX = Math.min(0, this.velocityX + this.FRICTION);
        }
    }

    handleCollisions(visibleEntities, newX, newY) {
        this.pCollButton = this.pCollLeft = this.pCollRight = false;

        for (let entity of visibleEntities) {
            if (entity.type !== 'solid') continue;

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

    checkVerticalCollision(entity, newX, newY) {
        return this.velocityY > 0 &&
               this.x + this.width > entity.x && 
               this.x < entity.x + entity.width &&
               newY + this.height > entity.y && 
               this.y + this.height <= entity.y;
    }

    checkLateralCollision(entity, newX, newY) {
        return newY + this.height > entity.y &&
               newY < entity.y + entity.height &&
               ((this.x + this.width <= entity.x && newX + this.width > entity.x) ||
                (this.x >= entity.x + entity.width && newX < entity.x + entity.width));
    }

    handleJump(currentTime) {
        if (currentTime - this.lastJumpTime >= this.JUMP_INTERVAL && this.pCollButton) {
            this.velocityY = this.JUMP_FORCE;
            this.velocityX = this.moveSpeed * this.direction;
            this.lastJumpTime = currentTime;
            this.isJumping = true;
            this.pCollButton = false;
        }
    }

    update(visibleEntities) {
        const currentTime = Date.now();
        
        if (this.view === true) {
            this.applyGravity();
        }

        let newPosition = this.handleCollisions(
            visibleEntities,
            this.x + this.velocityX,
            this.y + this.velocityY
        );

        this.x = newPosition.newX;
        this.y = newPosition.newY;

        this.applyFriction();
        this.handleJump(currentTime);
        this.checkPlayerCollision(currentTime); // Pasar el tiempo actual para el cooldown
    }

    checkPlayerCollision(currentTime) {
        if (!contextThisGame.player) return;
        const player = contextThisGame.player;
    
        // Verificar si hay colisión entre el jugador y el enemigo
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
                
            // Verificar cooldown antes de dañar al jugador
            if (currentTime - this.lastAttackTime >= this.ATTACK_COOLDOWN) {
                if (player.stats && player.stats.heal > 0) {
                    player.stats.heal -= this.stats.damage;
                    this.lastAttackTime = currentTime; // Actualizar el tiempo del último ataque
                }
            }
        }
    }

    draw(context, offsetX, offsetY) {
        super.draw(context, offsetX, offsetY);
    }
}

export { BasicEnemy };
