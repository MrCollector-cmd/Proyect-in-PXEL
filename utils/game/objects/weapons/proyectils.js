import { imagesController } from "../../../configs/imagesController.js";

class projectils {
    // Constructor de la clase proyectil
    constructor(x, y, targetX, targetY, power, gravity, path, trajectoryType = "parabolic", id) {
        this.x = x; // posición x del proyectil
        this.y = y; // posición y del proyectil
        this.id = id; // Id del proyectil
        
        const angle = Math.atan2(targetY - y, targetX - x); // calcula el ángulo de la flecha
        this.velocityX = Math.cos(angle) * power; // velocidad x de la flecha
        this.velocityY = Math.sin(angle) * power; // velocidad y de la flecha
        this.angle = angle; // ángulo de la flecha
        
        this.gravity = gravity; // gravedad de la flecha
        this.width = 45; // ancho de la flecha
        this.height = 15; // alto de la flecha
        this.size = Math.max(this.width, this.height); // tamaño de la flecha
        this.active = true; // estado del proyectil
        this.maxDistance = 1000; // distancia máxima de la flecha
        this.distanceTraveled = 0; // distancia recorrida por la flecha
        this.startX = x; // posición x inicial de la flecha
        this.startY = y; // posición y inicial de la flecha
        
        this.image = imagesController.loadImage(path); // carga la imagen de la flecha
        
        this.particles = []; // lista de partículas de la flecha
        this.exploding = false; // estado de la explosión de la flecha
        this.explosionDuration = 15; // duración de la explosión de la flecha
        this.explosionTimer = 0; // tiempo de la explosión de la flecha
        
        this.trajectoryType = trajectoryType; // Tipo de trayectoria (parabolic o lineal)
    }

    createExplosion() {
        this.exploding = true; //estado de la explosion de la flecha
        // Crear partículas pixeladas rojas
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12; //angulo de las partículas
            const speed = Math.random() * 3 + 2; //velocidad de las partículas
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

     // Actualiza el proyectil
     update(visibleEntities) {
        if (this.exploding) {
            // Actualizar partículas
            this.particles = this.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // pequeña gravedad
                particle.life -= 0.1;
                return particle.life > 0;
            });

            // Actualiza el tiempo de la explosión de la flecha
            this.explosionTimer++;
            if (this.explosionTimer >= this.explosionDuration && this.particles.length === 0) {
                this.active = false;
            }
            return;
        }

        const newX = this.x + this.velocityX; // nueva posición x de la flecha
        const newY = this.y + this.velocityY; // nueva posición y de la flecha

        this.angle = Math.atan2(this.velocityY, this.velocityX); // ángulo de la flecha

        for (let entity of visibleEntities) {
            if (entity.type === 'solid') {
                // Verifica si la flecha colisiona con un terreno
                if (this.checkCollisionWithTerrain(entity, newX, newY)) {
                    this.createExplosion();
                    return;
                }
            }
        }

        this.x = newX; // nueva posición x de la flecha
        this.y = newY; // nueva posición y de la flecha

        // Aplica gravedad solo si la trayectoria no es lineal
        if (this.trajectoryType !== "lineal") {
            this.velocityY += this.gravity; // velocidad y de la flecha
        }

        // Calcula la distancia recorrida por la flecha
        this.distanceTraveled = Math.sqrt(
            Math.pow(this.x - this.startX, 2) +
            Math.pow(this.y - this.startY, 2)
        );

        // Verifica si la distancia recorrida por la flecha es mayor que la distancia máxima
        if (this.distanceTraveled > this.maxDistance) {
            this.createExplosion(); // crea la explosión de la flecha
        }
    }

    draw(context, offsetX, offsetY) {
        if (!this.active) return; //verifica si el proyectil esta activo

        if (this.exploding) {
            // Dibujar partículas de explosión pixeladas y rojas
            this.particles.forEach(particle => {
                context.globalAlpha = particle.life; //transparencia de las partículas
                context.fillStyle = 'rgba(255, 0, 0, 0.8)';  //color de las partículas
                
                // Dibujamos un cuadrado en lugar de un círculo para el efecto pixelado
                const size = particle.size; //tamaño de las partículas
                context.fillRect(
                    Math.round(particle.x - offsetX - size/2), 
                    Math.round(particle.y - offsetY - size/2),
                    size, size
                );
            });
            context.globalAlpha = 1; //transparencia de las partículas
            return;
        }

        //dibuja la flecha
        if (this.image && this.image.complete) {
            context.save();
            context.translate(this.x - offsetX, this.y - offsetY); //traslada la flecha a la posicion x e y
            context.rotate(this.angle); //rota la flecha
            
            context.drawImage(
                this.image,
                -this.width, -this.height/2,
                this.width, this.height
            );
            
            context.restore();
        }
    }

    //verifica si la flecha colisiona con un terreno
    checkCollisionWithTerrain(terrain) {
        const collisionRadius = this.height; //radio de colision de la flecha
        return (
            this.x + collisionRadius > terrain.x &&
            this.x - collisionRadius < terrain.x + terrain.width &&
            this.y + collisionRadius > terrain.y &&
            this.y - collisionRadius < terrain.y + terrain.height
        );
    }

    //verifica si la flecha colisiona con un enemigo
    checkEnemyCollision(enemy) {
        // Verificar si el proyectil está explotando
        if (this.exploding) return false; //verifica si la flecha esta explotando

        // Calcular el centro del proyectil
        const projectileCenterX = this.x; //posicion x del proyectil
        const projectileCenterY = this.y; //posicion y del proyectil

        // Calcular el centro del enemigo
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;

        // Calcular la distancia entre los centros
        const dx = projectileCenterX - enemyCenterX;
        const dy = projectileCenterY - enemyCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Definir el radio de colisión (puedes ajustar este valor)
        const collisionRadius = (enemy.width + enemy.height) / 4;
        // Retornar true si hay colisión
        return distance < collisionRadius;
    }

    //dibuja los proyectiles
    static drawProjectiles(projectiles, context, offsetX, offsetY, visibleArea) {
        projectiles.forEach(projectile => {
            if (projectile.x + projectile.size > visibleArea.left &&
                projectile.x - projectile.size < visibleArea.right &&
                projectile.y + projectile.size > visibleArea.top &&
                projectile.y - projectile.size < visibleArea.bottom) {
                projectile.draw(context, offsetX, offsetY);
            }
        });
    }
}

export {projectils}