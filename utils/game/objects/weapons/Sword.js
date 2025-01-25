
import { SwordAssets } from "../../assets/SwordAssets.js";
import { contextThisGame } from "../context.js";
const canvas = document.getElementById('gameWorld');
const context = canvas.getContext('2d');

class Sword {
    constructor({ cooldown = 300 } = {}) {
        this.inventorySize = SwordAssets.getSizes().inventory;
        this.handSize = SwordAssets.getSizes().hand;

        // Estado de la espada
        this.cooldown = cooldown;
        this.lastAttackTime = 0; // Último tiempo de ataque
        this.attackRange = 50;
        this.attackPower = 15;

        this.currentFrame = SwordAssets.getFrames().frame1;

        // Variables para animación de ataque
        this.rotationAngle = -45.2; // Ángulo actual de la espada en radianes
        this.targetRotationAngle = -45.25; // Ángulo inicial como objetivo
        this.rotationSpeed = 5 * (Math.PI / 180); // Velocidad de rotación (5 grados por frame)

        this.isAnimating = false; // Estado de la animación
        this.shouldReturn = false; // Bandera para el regreso de la espada
    }

    drawInInventory(context, x, y, slotSize) {
        const frame1 = this.currentFrame;
        if (frame1 && frame1.complete) {
            const xOffset = (slotSize - this.inventorySize.width) / 2;
            const yOffset = (slotSize - this.inventorySize.height) / 2;
            context.drawImage(
                frame1,
                x + xOffset, y + yOffset,
                this.inventorySize.width, this.inventorySize.height
            );
        }
    }

    drawInHand(context, playerX, playerY, cameraOffsetX = 0, cameraOffsetY = 0) {
        const handOffsetX = -8;
        const handOffsetY = 20;

        const flip = this.isAnimating ? this.initialFlip : contextThisGame.player.direction;

        const adjustedOffsetX = flip ? -handOffsetX : handOffsetX;

        const baseAngle = -45.2; 
        const fixedAngle = (flip ? -baseAngle : baseAngle) * (Math.PI / 180);

        const rotatedOffsetX = Math.cos(fixedAngle) * adjustedOffsetX - Math.sin(fixedAngle) * handOffsetY;
        const rotatedOffsetY = Math.sin(fixedAngle) * adjustedOffsetX + Math.cos(fixedAngle) * handOffsetY;

        const swordX = playerX - cameraOffsetX + rotatedOffsetX;
        const swordY = playerY - cameraOffsetY + rotatedOffsetY;

        context.save();
        context.translate(swordX, swordY);

        if (flip) {
            context.scale(-1, 1);
            context.rotate(this.rotationAngle);
        } else {
            context.rotate(this.rotationAngle);
        }

        context.drawImage(
            this.currentFrame,
            0,
            -this.handSize.height / 2,
            this.handSize.width,
            this.handSize.height
        );
        context.restore();
    }

    startAnimation(targetAngle) {
        if (this.isAnimating) return; 
        this.targetRotationAngle = targetAngle * (Math.PI / 180);
        this.isAnimating = true;
        this.initialFlip = contextThisGame.player.direction;
        this.shouldReturn = false; // Evita que vuelva al ángulo inicial durante el ataque
    }
    updateAnimation() {
        if (!this.isAnimating) return;
        this.attack(contextThisGame.enemies);
        // Velocidad inicial y máxima
        const maxSpeed = 1; // Velocidad máxima para la ida
        const acceleration = 0.6; // Aceleración progresiva
    
        // Si la espada está "yendo hacia adelante"
        if (!this.shouldReturn) {
            // Acelera progresivamente la velocidad hacia el objetivo
            this.rotationSpeed = Math.min(this.rotationSpeed + acceleration, maxSpeed);
    
            // Calcula la diferencia normalizada entre el ángulo actual y el objetivo
            let angleDifference = this.targetRotationAngle - this.rotationAngle;
            angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;
    
            // Si la diferencia es pequeña, marca el regreso
            if (Math.abs(angleDifference) < this.rotationSpeed) {
                this.rotationAngle = this.targetRotationAngle; // Ajusta exactamente al objetivo
                this.shouldReturn = true; // Marca que debe regresar
                this.rotationSpeed = maxSpeed; // Resetea la velocidad para el regreso
            } else {
                // Incrementa o decrementa el ángulo según el signo de la diferencia
                this.rotationAngle += Math.sign(angleDifference) * this.rotationSpeed;
            }
            return; // Termina aquí hasta la siguiente llamada
        }
    
        // Si la espada está "regresando"
        const returnSpeed = 0.08; // Velocidad constante para el regreso
        const returnAngle = -45.2 * (Math.PI / 180); // Ángulo objetivo al regresar
    
        // Calcula la diferencia normalizada entre el ángulo actual y el regreso
        let angleDifference = returnAngle - this.rotationAngle;
        angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;
    
        if (Math.abs(angleDifference) < returnSpeed) {
            this.rotationAngle = returnAngle; // Ajusta exactamente al ángulo original
            this.isAnimating = false; // Finaliza la animación completamente
            contextThisGame.player.attack = false; // Detiene también el ataque
            this.shouldReturn = false; // Resetea la bandera de regreso
            this.rotationSpeed = 0; // Resetea la velocidad para la próxima animación
        } else {
            // Incrementa o decrementa el ángulo según el signo de la diferencia
            this.rotationAngle += Math.sign(angleDifference) * returnSpeed;
        }
    }

    attack(enemies) {
        if (!this.isAnimating) return; // Solo atacar durante la animación
        let { offsetX, offsetY } = contextThisGame.camera.getOffset();
        const player = contextThisGame.player;
        // Posición inicial del jugador
        const playerX = player.x - offsetX;
        const playerY = player.y - offsetY;
    
        // Calculamos la punta de la espada usando el ángulo actual
        let swordTipX, swordTipY;

        if (!player.direction) { // Derecha
            swordTipX = playerX+ 20 + Math.cos(this.rotationAngle) * this.attackRange;
            swordTipY = playerY + Math.sin(this.rotationAngle) * this.attackRange;
        } else if (player.direction) { // Izquierda
            swordTipX = playerX- 140 + Math.cos(this.rotationAngle) * this.attackRange;
            swordTipY = playerY+ Math.sin(this.rotationAngle) * this.attackRange;
        }
        // Rectángulo de colisión de la espada
        const swordRect = {
            x: (swordTipX - this.handSize.width / 2)+50,
            y: (swordTipY - this.handSize.height / 2)+30,
            width: this.handSize.width,
            height: this.handSize.height,
        };
    
        // Verificar colisiones con enemigos
        enemies.forEach((enemy, index) => {
            // Rectángulo del enemigo ajustado con la cámara
            const enemyRect = {
                x: enemy.x - offsetX,
                y: enemy.y - offsetY,
                width: enemy.width,
                height: enemy.height,
            };
    
            // Colisión AABB tradicional
            const isColliding =
                swordRect.x < enemyRect.x + enemyRect.width &&
                swordRect.x + swordRect.width > enemyRect.x &&
                swordRect.y < enemyRect.y + enemyRect.height &&
                swordRect.y + swordRect.height > enemyRect.y;
    
            if (isColliding) {
                // Aplica daño al enemigo y marca el golpe
                enemy.stats.heal -= this.attackPower;
                console.log(enemy.stats.heal)
                if (enemy.stats.heal <= 0) {
                    // Elimina el enemigo de la lista
                    contextThisGame.player.stats.xp += enemy.stats.xp;
                    contextThisGame.enemies = contextThisGame.enemies.filter(e => e !== enemy)
                }
            } 
        });
    
        // // Visualización para depuración (más gruesa para ver mejor)
        // context.lineWidth = 2; // Aumenta el grosor de la línea para la depuración
    
        // // Rectángulo de la espada (rojo)
        // context.beginPath();
        // context.rect(swordRect.x, swordRect.y, swordRect.width, swordRect.height);
        // context.strokeStyle = 'red';
        // context.stroke();
    
        // // Rectángulos de los enemigos (azul)
        // enemies.forEach((enemy) => {
        //     context.beginPath();
        //     context.rect(
        //         enemy.x - offsetX,
        //         enemy.y - offsetY,
        //         enemy.width,
        //         enemy.height
        //     );
        //     context.strokeStyle = 'blue';
        //     context.stroke();
        // });
    }
}

export { Sword };
