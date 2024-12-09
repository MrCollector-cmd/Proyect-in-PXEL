
class Camera {
    constructor(width, height, x, y) {
        this.width = width;  // Ancho de la cámara
        this.height = height;  // Alto de la cámara
        this.x = x;  // Coordenada X del centro de la cámara
        this.y = y;  // Coordenada Y del centro de la cámara
        this.cameraRotation = 0; // Rotación de la cámara
        this.smoothFactor = 0.1;  // Control de suavizado camara jugador
        this.smoothFactorRotate = 0.2;  // Control de suavizado camara rotacion
        this.maxRotation = Math.PI / 4;  // Límite de rotación (45 grados)
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
            const distanceFactor = 100; // Factor de alejamiento máximo
            const targetX = playerCenterX + offsetX / Math.sqrt(offsetX * offsetX + offsetY * offsetY) * distanceFactor;
            const targetY = playerCenterY + offsetY / Math.sqrt(offsetX * offsetX + offsetY * offsetY) * distanceFactor;
    
            // Suavizar el movimiento de la cámara hacia el objetivo
            this.x += (targetX - this.x) * this.smoothFactorRotate;
            this.y += (targetY - this.y) * this.smoothFactorRotate;
        }
    
        // Rotación de la cámara en torno al jugador
        const offsetX = posMouse.posX - playerCenterX;
        const offsetY = posMouse.posY - playerCenterY;
    
        // Calcular el ángulo de rotación
        if (Math.abs(offsetX) > 1e-5 || Math.abs(offsetY) > 1e-5) {
            // Ángulo hacia el mouse
            let angleTarget = Math.atan2(offsetY, offsetX);
    
            // Ajustar la sensibilidad de la rotación
            const rotationSensitivity = 2;  // Factor de sensibilidad de la rotación
            angleTarget *= rotationSensitivity;  // Amplificar la rotación
    
            // Suavizado de la rotación (reducción de suavizado para hacerla más rápida)
            const rotationSpeed = 1;  // Aumentamos la velocidad de rotación para hacerla más reactiva
            this.cameraRotation += (angleTarget - this.cameraRotation) * rotationSpeed;
    
            // Limitar la rotación dentro de los valores permitidos
            this.cameraRotation = Math.max(
                -this.maxRotation,
                Math.min(this.cameraRotation, this.maxRotation)
            );
        }
    }
    getVisibleArea() {
        const extraVisionY = this.height * 0.5; // Un 50% adicional de la altura visible
        return {
            left: this.x - this.width / 2 + 60,
            right: this.x + this.width / 2 + 60,
            top: this.y - this.height / 2 - extraVisionY, // Extiende hacia arriba
            bottom: this.y + this.height / 2 + extraVisionY, // Extiende hacia abajo
        };
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