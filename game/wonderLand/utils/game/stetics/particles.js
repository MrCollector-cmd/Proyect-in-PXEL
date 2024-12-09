import { Particle } from "../objects/particles.js"
const particles = {
    particles:[],
    maxParticles: 80,
    colors:[],
    animate:function(ctx,canvas) { 
       // Dibujar y actualizar las partículas
       for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        particle.update();
        particle.draw(ctx);

        // Eliminar partículas que han desaparecido
        if (particle.opacity <= 0 || particle.size <= 0) {
            this.particles.splice(i, 1);
        }
    }

    // Generar nuevas partículas si son menos de `maxParticles`
    while (this.particles.length < this.maxParticles) {
        this.spawnParticles(canvas);
    }
    },
    spawnParticles:function(canvas) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Generar una velocidad aleatoria
        const velocity = {
            x: (Math.random() - 0.5) * 2, // Entre -1 y 1
            y: (Math.random() - 0.5) * 2,
        };

        const size = Math.random() * 3 + 2; // Tamaño entre 2 y 5
        const color = `rgba(5,67,21,0.3)`; // Colores vivos

        this.particles.push(new Particle(x, y, size, color, velocity));
    }

}
export {particles}