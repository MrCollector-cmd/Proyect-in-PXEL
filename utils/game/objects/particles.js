class Particle {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.opacity = 0; // Empieza completamente transparente
        this.lifeSpan = Math.random() * 50 + 150; // Duración aleatoria
        this.age = 0; // Tiempo transcurrido desde la creación
        this.isDead = false;
    }

    draw(ctx, offsetX, offsetY) {
        // Ajustar las posiciones de la partícula según el desplazamiento de la cámara
        const drawX = this.x - offsetX;
        const drawY = this.y - offsetY;

        // Progresión de vida (0 a 1)
        const lifeProgress = this.age / this.lifeSpan;

        // Crear un gradiente radial dinámico para el aro de luz
        const outerGradient = ctx.createRadialGradient(
            drawX, drawY, this.size, // Centro del gradiente
            drawX, drawY, this.size * 8 // Radio exterior
        );

        // Opacidad gradual para el aro de luz
        const outerOpacity = Math.sin(lifeProgress * Math.PI); // Aparece y desaparece suavemente

        outerGradient.addColorStop(0, `rgba(255, 255, 100, ${outerOpacity * 0.2})`); // Luz suave
        outerGradient.addColorStop(1, `rgba(255, 255, 100, 0)`); // Transparente al borde

        // Dibujar el aro de luz
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size * 8, 0, Math.PI * 2);
        ctx.fill();

        // Crear un gradiente radial dinámico para la partícula
        const particleGradient = ctx.createRadialGradient(
            drawX, drawY, 0, // Centro del gradiente
            drawX, drawY, this.size * 4 // Radio exterior
        );

        const intensity = Math.max(0.5, Math.sin(lifeProgress * Math.PI)); // Mínimo 0.5 para evitar un brillo débil
        particleGradient.addColorStop(0, `rgba(255, 223, 0, ${this.opacity * intensity})`); // Amarillo brillante
        particleGradient.addColorStop(1, `rgba(248, 222, 56, 0)`); // Transparente al borde

        // Dibujar la partícula
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1; // Restaurar opacidad global
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Incrementar la edad
        this.age++;

        // Progresión de vida (0 a 1)
        const lifeProgress = this.age / this.lifeSpan;

        // Aumentar y reducir opacidad gradualmente
        this.opacity = Math.sin(lifeProgress * Math.PI); // Oscila de 0 a 1 y de vuelta a 0

        // Reducir tamaño lentamente
        this.size = Math.max(0, this.size - 0.02);

        // Marcar como muerta si ha alcanzado el final de su vida
        this.isDead = this.age >= this.lifeSpan;
    }
}

export {Particle}