import { contextThisGame } from "../objects/context.js"
import { BIOME_MOBS } from "../../configs/data/biomeMobs.js";
import { BasicEnemy } from "../objects/enemies/BasicEnemy.js";
import { readPatrons } from "./readPatrons.js";
import { size } from "../../configs/size.js";
const readSpawn = {
    spawnEnemies:function(biome,quantity=null,typeOrder=null){
        if (typeOrder==null) {
            typeOrder = readPatrons.getForwardRandomPositions(contextThisGame.mapThisGame.map.index1,quantity??undefined)
        }
        if (!BIOME_MOBS[biome]) {
            console.error(`El bioma "${biome}" no existe.`);
            return;
        }
        // Obtener los enemigos disponibles en el bioma
        const availableEnemies = BIOME_MOBS[biome];
    
        typeOrder.forEach(pos => {
            // Seleccionar un enemigo aleatorio del bioma
            const enemyId = Math.floor(Math.random() * Object.keys(availableEnemies).length) + 1;
            const enemyData = availableEnemies[enemyId];
    
            // Crear el enemigo con un objeto de estadísticas único
            const enemy = new BasicEnemy(
                pos.x, 
                pos.y - 1 * size.tils, 
                size.tils, 
                size.tils, 
                enemyData.sprite,  // Usar el sprite del enemigo
                "enemy", 
                { heal: enemyData.heal, damage: enemyData.damage, xp:enemyData.xp }  // Aquí creas un objeto nuevo con sus estadísticas
            );
    
            contextThisGame.enemies.push(enemy);
        });
    },
    spawnPlayer:function(){
        contextThisGame.spawn = contextThisGame.mapThisGame.map.index1.find(item=>item.id === -1)
        contextThisGame.player.x = contextThisGame.spawn.x
        contextThisGame.player.y = contextThisGame.spawn.y - 60
    },
    reespawnPayer:function(){
        if (contextThisGame.player.stats.heal <= 0 || 
            contextThisGame.player.x < 0 || 
            contextThisGame.player.x > contextThisGame.dimensions.width || 
            contextThisGame.player.y < 0 || 
            contextThisGame.player.y > contextThisGame.dimensions.height){

            contextThisGame.player.x = contextThisGame.spawn.x 
            contextThisGame.player.y = contextThisGame.spawn.y - 60
            contextThisGame.player.stats.heal = 10
            contextThisGame.player.movePlayer = false
        }
    }
}
export {readSpawn}