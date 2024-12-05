import { mouseControlls } from "../controlls/mouse.js";
class Camera {
    constructor(width, height, x, y) {
        this.width = width;  // Ancho de la cámara
        this.height = height;  // Alto de la cámara
        this.x = x;  // Coordenada X del centro de la cámara
        this.y = y;  // Coordenada Y del centro de la cámara
        this.cameraRotation = 0; // Rotación de la cámara
        this.smoothFactor = 0.7;  // Control de suavizado
        this.maxRotation = Math.PI / 2;  // Límite de rotación (45 grados)
    }

    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    follow(player, posMouse) {
        if (!player) {
            console.error("No se pudo obtener la posición del jugador.");
            return;
        }
        if (!posMouse) {
            console.error("No se pudo obtener la posición del mouse.");
            return;
        }
    
        // Variables base
        const playerCenterX = player.x + player.width / 2; // Centro del jugador
        const playerCenterY = player.y + player.height / 2;
    
        if (!posMouse.mouseOut) {
            // Si el mouse está dentro del rango, centra la cámara en el jugador
            const targetX = playerCenterX;
            const targetY = playerCenterY;
    
            // Suavizar el movimiento de la cámara hacia el jugador
            this.x += (targetX - this.x) * this.smoothFactor;
            this.y += (targetY - this.y) * this.smoothFactor;
        } else {
            // Si el mouse está fuera del rango, aleja la cámara hacia el mouse
            const offsetX = posMouse.posX - playerCenterX;
            const offsetY = posMouse.posY - playerCenterY;
    
            // Calcular el punto objetivo en la dirección del mouse
            const distanceFactor = 200; // Factor de alejamiento máximo
            const targetX = playerCenterX + offsetX / Math.sqrt(offsetX * offsetX + offsetY * offsetY) * distanceFactor;
            const targetY = playerCenterY + offsetY / Math.sqrt(offsetX * offsetX + offsetY * offsetY) * distanceFactor;
    
            // Suavizar el movimiento de la cámara hacia el objetivo
            this.x += (targetX - this.x) * this.smoothFactor;
            this.y += (targetY - this.y) * this.smoothFactor;
    
            // Rotar la cámara en la dirección del mouse
            const angleTarget = Math.atan2(offsetY, offsetX);
            this.cameraRotation = this.lerp(this.cameraRotation, angleTarget, this.smoothFactor);
        }
    }

    getOffset() {
        // Devuelve las coordenadas de la esquina superior izquierda de la cámara
        return {
            offsetX: this.x - this.width / 2,
            offsetY: this.y - this.height / 2
        };
    }
}

export { Camera };