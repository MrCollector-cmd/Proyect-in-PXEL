const collsObjects = {
    pColl: false,
    pCollX: false,
    pla: null,
    map: null,
    
    // Función para detectar colisiones
    collition: function () {
        let collitionArray = [];

        for (let i = 0; i < collsObjects.map.length; i++) {
            // Verificar la colisión y obtener el resultado
            let collisionResult = collsObjects.pla.player.checkCollision(collsObjects.map[i]);
            if (Array.isArray(collisionResult)) {
                if (collisionResult.includes('bottom')) {
                    collitionArray.push(-2);
                }
                if (collisionResult.includes('top')) {
                    collitionArray.push(2);
                }
                if (collisionResult.includes('left')) {
                    collitionArray.push(1);
                }
                if (collisionResult.includes('right')) {
                    collitionArray.push(-1);
                }
            }
        }
        return collitionArray;
    },

    // Función para revisar las colisiones y ajustar la posición
    checkCollision: function () {
        collsObjects.pla.refreshColl(); // Reiniciar las colisiones antes de cada movimiento
        let sideOfColitions = collsObjects.collition();

        if (Array.isArray(sideOfColitions)) {
            // Colisión superior
            if (sideOfColitions.includes(2)) {
                collsObjects.pla.pCollTop = true;
            }
            // Colisión inferior
            if (sideOfColitions.includes(-2)) {
                collsObjects.pla.pCollButton = true;
            }
            // Colisión derecha
            if (sideOfColitions.includes(-1)) {
                collsObjects.pla.pCollRight = true;
            }
            // Colisión izquierda
            if (sideOfColitions.includes(1)) {
                collsObjects.pla.pCollLeft = true;
            }
        }
    }
};

export {collsObjects}