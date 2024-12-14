import { Particle } from "../objects/particles.js"
const particles = {
    particles: [],
    maxParticles: 10,
    colors: [],
    animate: function (ctx, canvas, offsetX, offsetY) {
        // Dibujar y actualizar las partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();

            // Dibujar la partícula con el desplazamiento de la cámara aplicado
            particle.draw(ctx, offsetX, offsetY);

            // Eliminar partículas que han desaparecido
            if (particle.opacity <= 0 || particle.size <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Generar nuevas partículas si son menos de `maxParticles`
        while (this.particles.length < this.maxParticles) {
            this.spawnParticles(canvas, offsetX, offsetY);
        }
    },
    spawnParticles: function (canvas, offsetX, offsetY) {
        // Generar la posición de la partícula, considerando el desplazamiento de la cámara
        const x = Math.random() * canvas.width + offsetX;
        const y = Math.random() * canvas.height + offsetY;

        // Generar una velocidad aleatoria
        const velocity = {
            x: (Math.random() - 0.5) * 1, // Entre -0.5 y 0.5
            y: (Math.random() - 0.5) * 1,
        };

        const size = Math.random() * 3 + 2; // Tamaño entre 2 y 5
        const color = `rgba(5,67,21,0.3)`; // Colores vivos

        this.particles.push(new Particle(x, y, size, color, velocity));
    }
};
export {particles}