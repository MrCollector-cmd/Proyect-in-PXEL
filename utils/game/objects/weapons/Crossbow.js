import { projectils } from "./proyectils.js";
import { mouseControlls } from "../../controlls/mouse.js";
import { CrossbowAssets } from "../../assets/Crossbow.js";

class Crossbow {
    constructor({maxCharge = 1000, cooldown = 300} = {}) {
        // Inicializar tamaño de inventario y mano
        this.inventorySize = CrossbowAssets.getSizes().inventory;
        this.handSize = CrossbowAssets.getSizes().hand;

        // Estado del arco
        this.charging = false;
        this.charge = 0;
        this.chargeStartTime = 0;
        this.maxCharge = maxCharge;
        this.cooldown = cooldown;
        this.lastProjectileTime = 0;

        // Utilizamos una única imagen para el arco
        this.currentFrame = CrossbowAssets.getFrames().frame1; // Accede directamente a la imagen
    }

    //dibuja el arco en el inventario
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

    //dibuja el arco en la mano del jugador
    drawInHand(context, playerX, playerY, cameraOffsetX = 0, cameraOffsetY = 0) {
        const handOffset = 12; // Distancia del arco al centro del jugador

        const mousePos = mouseControlls.getPosMouse();
        const angle = Math.atan2(
            mousePos.posY - (playerY - cameraOffsetY),
            mousePos.posX - (playerX - cameraOffsetX)
        );

        const bowX = playerX - cameraOffsetX + Math.cos(angle) * handOffset;
        const bowY = playerY + 12 - cameraOffsetY + Math.sin(angle) * handOffset;

        const scale = this.handSize.height / this.currentFrame.height;
        let widthMultiplier = 1.5;
        const scaledWidth = this.currentFrame.width * scale * widthMultiplier;

        context.save();

        // Trasladar al punto del arco y rotar
        context.translate(bowX, bowY);
        context.rotate(angle);

        // Dibujar el arco con origen ajustado
        context.drawImage(
            this.currentFrame,
            (-scaledWidth / 2) + 30 ,
            -this.handSize.height / 2,
            scaledWidth,
            this.handSize.height
        );

        context.restore();
    }
     //obtiene la posicion del arco
     getPosition(playerX, playerY) {
        const handOffsetX = 26;
        const handOffsetY = 15;
        
        // Obtener la posición del mouse
        const mousePos = mouseControlls.getPosMouse();
        
        // Calcular el ángulo hacia el mouse
        const angle = Math.atan2(
            mousePos.posY - playerY,
            mousePos.posX - playerX
        );
        
        // Calcular la posición del arco usando el ángulo
        const bowX = playerX + Math.cos(angle) * handOffsetX;
        const bowY = playerY + Math.sin(angle) * handOffsetX + handOffsetY;
        
        return { x: bowX, y: bowY };
    }

    //inicia la carga del arco
    startCharging() {
        if (Date.now() - this.lastProjectileTime >= this.cooldown) {
            this.charging = true;
            this.charge = 0;
            this.chargeStartTime = Date.now();
            return true;
        }
        return false;
    }

    //libera la carga del arco
    releaseCharge(playerX, playerY, targetX, targetY) {
        if (!this.charging) return null;

        const chargeTime = Date.now() - this.chargeStartTime;
        this.charge = Math.min(chargeTime, this.maxCharge);

        const chargeRatio = this.charge / this.maxCharge;
        const power = 30 + chargeRatio * 20;
        const gravity = 1.5 - chargeRatio * 1.3;

        const projectile = new projectils(
            playerX + 12,
            playerY,
            targetX,
            targetY,
            power,
            gravity,
            "src/weapons/distanceWeapons/bulletNyanGun.png",
            'lineal',
            2
        );
        
        // Crea una instancia del sonido
        const projectileSound = new Audio('src/sounds/fire/miau.mp3');  // Reemplaza con la ruta de tu archivo de sonido

        
        // Ajusta el volumen (por ejemplo, al 50%)
        projectileSound.volume = 0.5;

        // Reproduce el sonido
        projectileSound.play();

        this.lastProjectileTime = Date.now();
        this.charging = false;

        return projectile;
    }

}

export { Crossbow };
