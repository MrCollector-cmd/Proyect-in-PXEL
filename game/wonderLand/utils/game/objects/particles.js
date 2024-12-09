class Particle {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.opacity = 1;
        this.lifeSpan = Math.random() * 100 + 50;
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0, // Centro del gradiente
            this.x, this.y, this.size * 4 // Radio exterior
        );

        // Gradiente radial para simular luz
        gradient.addColorStop(0, `rgba(255, 223, 0, ${this.opacity})`); // Amarillo brillante
        gradient.addColorStop(1, `rgba(255, 223, 0, 0)`); // Transparente al final

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // Restaurar opacidad global
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 1 / this.lifeSpan;
        this.size -= 0.02; // Decrece lentamente
        if (this.size < 0) this.size = 0;
    }
}
export {Particle}