class Camera {
    constructor(width, height, x, y) {
        this.width = width;  // Ancho de la cámara
        this.height = height;  // Alto de la cámara
        this.x = x;  // Coordenada X del centro de la cámara
        this.y = y;  // Coordenada Y del centro de la cámara
        this.smoothFactor = 0.6;  // Control de suavizado
    }

    follow(player, mapWidth, mapHeight) {
        // Calcular el objetivo de la cámara (centrado en el jugador)
        const targetX = player.x + player.width / 2;  // Centro del jugador
        const targetY = player.y + player.height / 2; // Centro del jugador

        // Suavizar el movimiento de la cámara
        this.x += (targetX - this.x) * this.smoothFactor;
        this.y += (targetY - this.y) * this.smoothFactor;

        // // Limitar el movimiento de la cámara a los bordes del mapa
        // // No permitir que la cámara se desplace fuera de los límites del mapa
        // this.x = Math.max(this.width / 2, Math.min(this.x, mapWidth - this.width / 2));
        // this.y = Math.max(this.height / 2, Math.min(this.y, mapHeight - this.height / 2));
    }

    getOffset() {
        // Devuelve las coordenadas de la esquina superior izquierda de la cámara
        return {
            offsetX: this.x - this.width / 2,
            offsetY: this.y - this.height / 2
        };
    }
}

export {Camera}
