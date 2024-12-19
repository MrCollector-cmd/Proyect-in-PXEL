import { imagesController } from "../../configs/imagesController.js";

class Projectile {
    constructor(x, y, targetX, targetY, power, gravity) {
        this.x = x;
        this.y = y;
        
        const angle = Math.atan2(targetY - y, targetX - x);
        this.velocityX = Math.cos(angle) * power;
        this.velocityY = Math.sin(angle) * power;
        this.angle = angle;
        
        this.gravity = gravity;
        this.width = 45;
        this.height = 15;
        this.size = Math.max(this.width, this.height);
        this.active = true;
        this.maxDistance = 1000;
        this.distanceTraveled = 0;
        this.startX = x;
        this.startY = y;
        
        this.image = imagesController.loadImage("src/weapons/Arrow.png");
        
        this.particles = [];
        this.exploding = false;
        this.explosionDuration = 15;
        this.explosionTimer = 0;
    }

    createExplosion() {
        this.exploding = true;
        // Crear partículas pixeladas rojas
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const speed = Math.random() * 3 + 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                size: Math.random() * 4 + 3  // Partículas más grandes
            });
        }
    }

    update(visibleEntities) {
        if (this.exploding) {
            // Actualizar partículas
            this.particles = this.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Pequeña gravedad
                particle.life -= 0.1;
                return particle.life > 0;
            });

            this.explosionTimer++;
            if (this.explosionTimer >= this.explosionDuration && this.particles.length === 0) {
                this.active = false;
            }
            return;
        }

        const newX = this.x + this.velocityX;
        const newY = this.y + this.velocityY;
        
        this.angle = Math.atan2(this.velocityY, this.velocityX);
        
        for (let entity of visibleEntities) {
            if (entity.type === 'solid') {
                if (this.checkCollisionWithTerrain(entity, newX, newY)) {
                    this.createExplosion();
                    return;
                }
            }
        }
        
        this.x = newX;
        this.y = newY;
        this.velocityY += this.gravity;

        this.distanceTraveled = Math.sqrt(
            Math.pow(this.x - this.startX, 2) + 
            Math.pow(this.y - this.startY, 2)
        );

        if (this.distanceTraveled > this.maxDistance) {
            this.createExplosion();
        }
    }

    draw(context, offsetX, offsetY) {
        if (!this.active) return;

        if (this.exploding) {
            // Dibujar partículas de explosión pixeladas y rojas
            this.particles.forEach(particle => {
                context.globalAlpha = particle.life;
                context.fillStyle = 'rgba(255, 0, 0, 0.8)';  // Rojo
                
                // Dibujamos un cuadrado en lugar de un círculo para el efecto pixelado
                const size = particle.size;
                context.fillRect(
                    Math.round(particle.x - offsetX - size/2), 
                    Math.round(particle.y - offsetY - size/2),
                    size, size
                );
            });
            context.globalAlpha = 1;
            return;
        }

        if (this.image && this.image.complete) {
            context.save();
            context.translate(this.x - offsetX, this.y - offsetY);
            context.rotate(this.angle);
            
            context.drawImage(
                this.image,
                -this.width, -this.height/2,
                this.width, this.height
            );
            
            context.restore();
        }
    }

    checkCollisionWithTerrain(terrain, newX, newY) {
        const collisionRadius = this.height;
        return (
            newX + collisionRadius > terrain.x &&
            newX - collisionRadius < terrain.x + terrain.width &&
            newY + collisionRadius > terrain.y &&
            newY - collisionRadius < terrain.y + terrain.height
        );
    }

    checkEnemyCollision(enemy) {
        return (
            this.x + this.size > enemy.x &&
            this.x - this.size < enemy.x + enemy.width &&
            this.y + this.size > enemy.y &&
            this.y - this.size < enemy.y + enemy.height
        );
    }
}

export { Projectile }; 