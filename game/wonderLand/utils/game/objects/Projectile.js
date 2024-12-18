class Projectile {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        
        // Calcular la dirección del proyectil
        const angle = Math.atan2(targetY - y, targetX - x);
        this.velocityX = Math.cos(angle) * 15; // Velocidad aumentada a 15
        this.velocityY = Math.sin(angle) * 15;
        
        this.size = 8;
        this.active = true;
        this.maxDistance = 1000; // Distancia máxima que puede recorrer
        this.distanceTraveled = 0;
        this.startX = x;
        this.startY = y;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Calcular distancia recorrida
        this.distanceTraveled = Math.sqrt(
            Math.pow(this.x - this.startX, 2) + 
            Math.pow(this.y - this.startY, 2)
        );

        // Desactivar si ha recorrido la distancia máxima
        if (this.distanceTraveled > this.maxDistance) {
            this.active = false;
        }
    }

    draw(context, offsetX, offsetY) {
        if (!this.active) return;
        
        context.fillStyle = 'rgba(0, 200, 255, 0.8)';
        context.beginPath();
        context.arc(this.x - offsetX, this.y - offsetY, this.size, 0, Math.PI * 2);
        context.fill();
        
        // Agregar brillo
        context.shadowColor = 'rgba(0, 200, 255, 0.5)';
        context.shadowBlur = 10;
        context.fill();
        context.shadowBlur = 0;
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