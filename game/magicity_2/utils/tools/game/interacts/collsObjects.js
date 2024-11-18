const collsObjects = {
    pColl: false,
    pCollX: false,
    pla: null,
    map: null,
    // collition: function () {
    //     for (let i = 0; i < collsObjects.map.length; i++) {
    //         if (collsObjects.pla.player.checkCollision(collsObjects.map[i]) === 'bottom') {
    //             return -2
    //         }
    //         if (collsObjects.pla.player.checkCollision(collsObjects.map[i]) === 'top') {
    //             return 2
    //         }if (collsObjects.pla.player.checkCollision(collsObjects.map[i]) === 'left') {
    //             return 1
    //         }if (collsObjects.pla.player.checkCollision(collsObjects.map[i]) === 'right') {
    //             return -1
    //         }
    //     }
    // }
    collition: function () {
        let collitionArray = [];
        
        for (let i = 0; i < collsObjects.map.length; i++) {
            // Verificar la colisión y obtener el resultado
            let collisionResult = collsObjects.pla.player.checkCollision(collsObjects.map[i])
            if (Array.isArray(collisionResult)) {
                if (collisionResult.includes('bottom')) {
                    collitionArray.push(-2)
                }
                if (collisionResult.includes('top')) {
                    collitionArray.push(2)
                }
                if (collisionResult.includes('left')) {
                    collitionArray.push(1)
                }
                if (collisionResult.includes('right')) {
                    collitionArray.push(-1)
                }
            }
        }
        return collitionArray
    }
    ,
    checkCollision: function (){
        collsObjects.pla.refreshColl();
        let sideOfColitions = collsObjects.collition(collsObjects.pla, collsObjects.map);
        if (Array.isArray(sideOfColitions)) {
            if ( sideOfColitions.includes(2)) {
                collsObjects.pColl = true
                collsObjects.pla.pCollTop = collsObjects.pColl
            }
            if(sideOfColitions.includes(-2)) {
                collsObjects.pColl = true
                collsObjects.pla.pCollButton = collsObjects.pColl
            }if(sideOfColitions.includes(-1)){
                collsObjects.pCollX = true
                collsObjects.pla.pCollRight = collsObjects.pCollX
            }
            if(sideOfColitions.includes(1)){
                collsObjects.pCollX = true
                collsObjects.pla.pCollLeft = collsObjects.pCollX
            }
        }
        requestAnimationFrame(collsObjects.checkCollision);
        }
};

export {collsObjects}