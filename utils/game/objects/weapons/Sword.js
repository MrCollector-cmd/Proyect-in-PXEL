import { mouseControlls } from "../../controlls/mouse.js";
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
        this.rotationAngle = -45; // Ángulo actual de la espada en radianes
        this.targetRotationAngle = -45; // Ángulo inicial como objetivo
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
        const handOffsetX = 10;
        const handOffsetY = 20;

        const flip = this.isAnimating ? this.initialFlip : contextThisGame.player.direction;

        const adjustedOffsetX = flip ? -handOffsetX : handOffsetX;

        const baseAngle = 45; 
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

 // Método para actualizar la animación
updateAnimation() {
    // Si la animación no está activa pero debe regresar, configura el regreso
    console.log(this.targetRotationAngle)
    if (!this.isAnimating && this.shouldReturn) {
        this.targetRotationAngle = -45 * (Math.PI / 180); // Configura el ángulo inicial como objetivo
        this.isAnimating = true; // Activa la animación
        this.shouldReturn = false; // Desactiva el estado de regreso
    }
    console.log(!this.isAnimating && this.shouldReturn)
    if (!this.isAnimating) return;

    // Calcula la diferencia normalizada entre el ángulo actual y el objetivo
    let angleDifference = this.targetRotationAngle - this.rotationAngle;

    // Normalizar la diferencia al rango [-π, π]
    angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;

    // Si la diferencia es pequeña, termina la animación
    if (Math.abs(angleDifference) < this.rotationSpeed) {
        this.rotationAngle = this.targetRotationAngle; // Ajusta exactamente al objetivo
        this.isAnimating = false; // Detiene la animación

        // Si el retorno estaba activo y se alcanzó el objetivo, marca que terminó
        if (this.rotationAngle === -45 * (Math.PI / 180)) {
            this.shouldReturn = false; // Asegúrate de que no intente regresar nuevamente
        }

        contextThisGame.player.attack = false; // Asegura que el ataque también finalice
        this.returnToInitialPosition()
        return;
    }

    // Incrementa o decrementa el ángulo según el signo de la diferencia
    this.rotationAngle += Math.sign(angleDifference) * this.rotationSpeed;
}

// Método para marcar el regreso de la espada
returnToInitialPosition() {
    console.log('asda')
    this.shouldReturn = true; // Marca que la espada debe regresar a su posición inicial
}
    
}

export { Sword };
