import { imagesController } from "../../../configs/imagesController.js";
import { contextThisGame } from "../../objects/context.js";
import { Projectile } from "../../objects/Projectile.js";

class Bow {
    constructor() {
        this.frames = {
            frame1: imagesController.loadImage("src/weapons/BowFrame1.png"),
            frame2: imagesController.loadImage("src/weapons/BowFrame2.png"),
            frame3: imagesController.loadImage("src/weapons/BowFrame3.png")
        };
        this.currentFrame = this.frames.frame1;
        
        this.inventorySize = {
            width: 25,
            height: 55
        };
        this.handSize = {
            width: 15,
            height: 60
        };
        
        this.charging = false;
        this.charge = 0;
        this.chargeStartTime = 0;
        this.maxCharge = 1000;
        this.cooldown = 300;
        this.lastProjectileTime = 0;
    }

    updateFrame(chargeRatio = 0) {
        if (chargeRatio >= 0.66) {
            this.currentFrame = this.frames.frame3;
        } else if (chargeRatio >= 0.33) {
            this.currentFrame = this.frames.frame2;
        } else {
            this.currentFrame = this.frames.frame1;
        }
    }

    drawInInventory(context, x, y, slotSize) {
        if (this.frames.frame1 && this.frames.frame1.complete) {
            const xOffset = (slotSize - this.inventorySize.width) / 2;
            const yOffset = (slotSize - this.inventorySize.height) / 2;
            context.drawImage(
                this.frames.frame1,
                x + xOffset, y + yOffset,
                this.inventorySize.width, this.inventorySize.height
            );
        }
    }

    drawInHand(context, x, y, offsetX, offsetY) {
        if (!this.currentFrame || !this.currentFrame.complete) return;
        
        const playerDirection = contextThisGame.player.direction;
        const handOffsetX = playerDirection ? -26 : 26;
        const handOffsetY = 15;
        
        // Calcular dimensiones
        const scale = this.handSize.height / this.currentFrame.height;
        let widthMultiplier = 1;
        if (this.currentFrame === this.frames.frame2) widthMultiplier = 1.1;
        if (this.currentFrame === this.frames.frame3) widthMultiplier = 1.2;
        const scaledWidth = this.currentFrame.width * scale * widthMultiplier;
        
        context.save();
        
        // Calcular posición base
        let drawX;
        if (playerDirection) {
            // Mirando a la izquierda
            drawX = x - offsetX - handOffsetX - scaledWidth;
        } else {
            // Mirando a la derecha
            drawX = x - offsetX + handOffsetX - scaledWidth;
        }
        const drawY = y - offsetY + handOffsetY - (this.handSize.height / 2);
        
        if (playerDirection) {
            context.translate(x - offsetX, y - offsetY);
            context.scale(-1, 1);
            context.translate(-(x - offsetX), -(y - offsetY));
        }
        
        context.drawImage(
            this.currentFrame,
            drawX,
            drawY,
            scaledWidth,
            this.handSize.height
        );
        
        context.restore();
    }

    startCharging() {
        if (Date.now() - this.lastProjectileTime >= this.cooldown) {
            this.charging = true;
            this.charge = 0;
            this.chargeStartTime = Date.now();
            return true;
        }
        return false;
    }

    releaseCharge(playerX, playerY, targetX, targetY) {
        if (!this.charging) return null;

        const chargeTime = Date.now() - this.chargeStartTime;
        this.charge = Math.min(chargeTime, this.maxCharge);
        
        const chargeRatio = this.charge / this.maxCharge;
        const power = 15 + chargeRatio * 20;
        const gravity = 1.5 - chargeRatio * 1.3;
        
        const projectile = new Projectile(
            playerX,
            playerY,
            targetX,
            targetY,
            power,
            gravity
        );

        this.lastProjectileTime = Date.now();
        this.charging = false;
        
        return projectile;
    }
}

export { Bow }; 