import { contextThisGame } from "../objects/context.js";

const toolsOfDrawing = {
    drawWater:function(offsetX,offsetY,visibleArea,visibleEntitiesFirstLayer,context){
        if(!contextThisGame.ini)return
        if (contextThisGame.mapThisGame.map.index3) {
            contextThisGame.mapThisGame.map.index3.forEach(entity => {
                if (
                    entity.x + entity.width > visibleArea.left -200 &&
                    entity.x < visibleArea.right +200 &&
                    entity.y + entity.height > visibleArea.top &&
                    entity.y < visibleArea.bottom
                ) {
                    visibleEntitiesFirstLayer.push(entity); // Almacenamos las entidades visibles
                }
            });
        }
        visibleEntitiesFirstLayer.forEach(entity => {
            if (entity.id === 6) {
                entity.draw(context, offsetX, offsetY);
            }
        });
    },
    drawInLayers:function(allIndex,offsetX,offsetY,visibleArea,visibleEntities,context){
        if(!contextThisGame.ini)return
        let obj = allIndex;
        // Almacenar entidades visibles
        visibleEntities = [];
        for (const indexDraw of obj) {
            if (contextThisGame.mapThisGame.map[indexDraw] !== null && indexDraw !== 'index3') {
                contextThisGame.mapThisGame.map[indexDraw].forEach(entity => {
                    if (
                        entity.x + entity.width > visibleArea.left - 500&&
                        entity.x < visibleArea.right + 200 &&
                        entity.y + entity.height > visibleArea.top &&
                        entity.y < visibleArea.bottom
                    ) {
                        visibleEntities.push(entity); // Almacenamos las entidades visibles
                    }
                });
            }
        }

        visibleEntities.forEach(entity => {
            entity.draw(context, offsetX, offsetY);
        });

        return visibleEntities
    },
    drawEnemies:function(offsetX,offsetY,visibleArea,context){
        contextThisGame.enemies.forEach(enemy => {
            //verifica si el enemigo esta en la pantalla
            if (enemy.x + enemy.width > visibleArea.left - 500&&
                enemy.x < visibleArea.right + 200  &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom) {
                enemy.draw(context, offsetX, offsetY);
            }
        });
    }
}

export {toolsOfDrawing}