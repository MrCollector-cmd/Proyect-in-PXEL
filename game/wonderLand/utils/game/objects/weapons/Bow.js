import { imagesController } from "../../../configs/imagesController.js";
import { contextThisGame } from "../../objects/context.js";
import { Projectile } from "../../objects/Projectile.js";
import { mouseControlls } from "../../controlls/mouse.js";

class Bow {
    constructor() {
        this.frames = {
            frame1: imagesController.loadImage("src/weapons/BowFrame1.png"),
            frame2: imagesController.loadImage("src/weapons/BowFrame2.png"),
            frame3: imagesController.loadImage("src/weapons/BowFrame3.png")
        };
        this.currentFrame = this.frames.frame1;
        
        //tamaño de la arco en el inventario
        this.inventorySize = {
            width: 25,              
            height: 55
        };

        //tamaño de la arco en la mano
        this.handSize = {
            width: 15,
            height: 60
        };
        
        this.charging = false; //si la arco esta cargando
        this.charge = 0; //carga de la arco
        this.chargeStartTime = 0; //tiempo de inicio de la carga
        this.maxCharge = 1000; //carga maxima de la arco
        this.cooldown = 300; //tiempo de recarga de la arco
        this.lastProjectileTime = 0; //tiempo del ultimo proyectil
    }

    //actualiza el frame de la arco
    updateFrame(chargeRatio = 0) {
        if (chargeRatio >= 0.66) {
            this.currentFrame = this.frames.frame3; //frame 3 de la arco
        } else if (chargeRatio >= 0.33) {
            this.currentFrame = this.frames.frame2; //frame 2 de la arco
        } else {
            this.currentFrame = this.frames.frame1; //frame 1 de la arco
        }
    }

    //dibuja la arco en el inventario
    drawInInventory(context, x, y, slotSize) {
        if (this.frames.frame1 && this.frames.frame1.complete) {
            const xOffset = (slotSize - this.inventorySize.width) / 2; //offset x de la arco
            const yOffset = (slotSize - this.inventorySize.height) / 2; //offset y de la arco
            context.drawImage(
                this.frames.frame1,
                x + xOffset, y + yOffset,
                this.inventorySize.width, this.inventorySize.height
            );
        }
    }

    //dibuja la arco en la mano
    drawInHand(context, x, y, offsetX, offsetY) {
        if (!this.currentFrame || !this.currentFrame.complete) return;
        
        const handOffsetX = 26;
        const handOffsetY = 15;
        
        // Calcular dimensiones
        const scale = this.handSize.height / this.currentFrame.height;
        let widthMultiplier = 1;
        if (this.currentFrame === this.frames.frame2) widthMultiplier = 1.1;
        if (this.currentFrame === this.frames.frame3) widthMultiplier = 1.2;
        const scaledWidth = this.currentFrame.width * scale * widthMultiplier;
        
        context.save();

        // Obtener la posición del mouse usando mouseControlls
        const mousePos = mouseControlls.getPosMouse();
        
        // Calcular el ángulo hacia el mouse
        const angle = Math.atan2(
            mousePos.posY - (y - offsetY),
            mousePos.posX - (x - offsetX)
        );
        
        // Posición base del arco
        const baseX = x - offsetX;
        const baseY = y - offsetY + handOffsetY;
        
        // Trasladar al punto de rotación y rotar
        context.translate(baseX, baseY);
        context.rotate(angle);
        
        // Dibujar el arco con origen ajustado
        context.drawImage(
            this.currentFrame,
            -scaledWidth,
            -this.handSize.height / 2,
            scaledWidth,
            this.handSize.height
        );
        
        context.restore();
    }

    //inicia la carga de la arco
    startCharging() {
        if (Date.now() - this.lastProjectileTime >= this.cooldown) {
            this.charging = true;
            this.charge = 0;
            this.chargeStartTime = Date.now();
            return true;
        }
        return false;
    }

    //libera la carga de la arco
    releaseCharge(playerX, playerY, targetX, targetY) {
        if (!this.charging) return null;

        const chargeTime = Date.now() - this.chargeStartTime;
        this.charge = Math.min(chargeTime, this.maxCharge);
        
        const chargeRatio = this.charge / this.maxCharge; //ratio de la carga
        const power = 15 + chargeRatio * 20; //potencia de la flecha
        const gravity = 1.5 - chargeRatio * 1.3; //gravedad de la flecha
        
        const projectile = new Projectile(
            playerX,
            playerY,
            targetX,
            targetY,
            power,
            gravity
        );

        this.lastProjectileTime = Date.now(); //tiempo del ultimo proyectil
        this.charging = false; //la arco ya no esta cargando
        
        return projectile;
    }
}

export { Bow }; 