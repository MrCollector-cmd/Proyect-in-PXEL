const collsObjects = {
    pColl: false,
    pCollX: false,
    pla: null,
    map: null,
    
    // Función para detectar colisiones
    checkCollision() {
        // Reiniciar colisiones del jugador
        this.pla.refreshColl();
    
        // Iterar sobre los objetos del mapa
        for (let mapObj of this.map) {
            const collisions = mapObj.checkCollision(this.pla.player); // Verificar colisión
    
            if (collisions) {
                // Procesar cada dirección de colisión detectada
                collisions.forEach(direction => {
                    switch (direction) {
                        case 'top':
                            this.pla.pCollTop = true;
                            this.pla.player.y = mapObj.y + mapObj.height; // Ajustar posición
                            break;
                        case 'bottom':
                            this.pla.pCollButton = true;
                            this.pla.player.y = mapObj.y - this.pla.player.height;
                            break;
                        case 'left':
                            this.pla.pCollLeft = true;
                            this.pla.player.x = mapObj.x + mapObj.width;
                            break;
                        case 'right':
                            this.pla.pCollRight = true;
                            this.pla.player.x = mapObj.x - this.pla.player.width;
                            break;
                    }
                });
            }
        }
    }
};

export { collsObjects };
