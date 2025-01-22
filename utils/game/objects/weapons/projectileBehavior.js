import { contextThisGame } from "../context.js"
import { projectils } from "./proyectils.js";
const proyectilBehaivior ={
    updateProyectils: function(projectiles, visibleEntitiesFirstLayer, enemies) {
        if (!Array.isArray(projectiles)) {
            console.error("this.projectiles is not an array:", projectiles);
            projectiles = []; // Corrige para evitar errores futuros
        }
        // Continúa con la lógica original
        let enemiesToRemove = [];
        let projectileCollisionDetected = false;

        projectiles = projectiles.filter(projectile => {
            projectile.update(visibleEntitiesFirstLayer);

            for (let enemy of enemies) {
                if (projectile.checkEnemyCollision(enemy)) {
                    if (enemy.stats.heal > 0) {
                        enemy.stats.heal -= 5;
                        if (enemy.stats.heal <= 0) {
                            contextThisGame.player.stats.xp += enemy.stats.xp;
                            enemiesToRemove.push(enemy);
                        }
                    }
                    projectileCollisionDetected = true;
                    projectile.createExplosion();
                    return false; // Desactiva el proyectil
                }
            }

            for (let entity of visibleEntitiesFirstLayer) {
                if (entity.type === 'solid' && projectile.checkCollisionWithTerrain(entity, projectile.x, projectile.y)) {
                    projectile.createExplosion();
                    projectileCollisionDetected = true;
                    return false;
                }
            }

            return projectile.active;
        });

        if (projectileCollisionDetected) {
            contextThisGame.player.stats.proyectils.shift();
        }

        enemies = enemies.filter(enemy => !enemiesToRemove.includes(enemy));
        return enemies
    },
    drawProjectiles(ctx, offsetX, offsetY, projectiles, camera) {
        if(projectiles.length <= 0) return
        // Dibuja los proyectiles
        projectils.drawProjectiles(projectiles, ctx, offsetX, offsetY, camera.getVisibleArea());
    }
}
export {proyectilBehaivior}