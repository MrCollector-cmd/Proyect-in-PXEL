const collsObjects = {
    pColl: false,
    pCollX: false,
    pla: null,
    map: null,
    
    // Función para detectar colisiones
    checkCollision :function() {
        for (let i = 0; i < this.map.length; i++) {
            let obj = this.map[i];
            if (obj.type === 'solid') {
                // Aquí pasa el objeto 'Player' y no el rectángulo
                const isColliding = this.pla.player.checkCollision(obj);
                if (isColliding) {
                    // Aquí se resuelve la colisión pasando el objeto 'Player'
                    this.resolveCollision(this.pla, obj);  // Pasar 'this.pla' (el objeto Player)
                }
            }
        }
    },
    resolveCollision :function(player, obj) {
        // Comprobamos las colisiones usando el método checkCollision de Rect
        const collisions = player.player.checkCollision(obj); // Usamos checkCollision del jugador (Rect)
    
        if (collisions) {
            // Si hay una colisión, ajustamos la posición del jugador dependiendo de la dirección de la colisión
            collisions.forEach(collision => {
                switch (collision) {
                    case 'left':
                        player.pCollLeft = true;
                        break;
                    case 'right':
                        player.pCollRight = true;
                        break;
                    case 'top':
                        player.pCollTop = true;
                        break;
                    case 'bottom':
                        player.pCollButton = true;
    
                        break;
                }
            });
        }
    }
};

export { collsObjects };
