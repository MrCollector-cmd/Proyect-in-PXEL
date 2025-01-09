import { Projectile } from "../../objects/Projectile.js";
import { mouseControlls } from "../../controlls/mouse.js";
import { BowAssets } from "../../assets/BowAssets.js";

class Bow {
    constructor() {
        // Inicializar frames y tamaños
        this.frames = BowAssets.getFrames();
        this.currentFrame = this.frames.frame1;
        this.inventorySize = BowAssets.getSizes().inventory;
        this.handSize = BowAssets.getSizes().hand;
        
        // Estado del arco
        this.charging = false;
        this.charge = 0;
        this.chargeStartTime = 0;
        this.maxCharge = 1000;
        this.cooldown = 300;
        this.lastProjectileTime = 0;

        // Asegurarnos de que las imágenes estén cargadas
        this.checkImagesLoaded();
    }

    //verifica si las imagenes estan cargadas
    checkImagesLoaded() {
        if (!BowAssets.areImagesLoaded()) {
            setTimeout(() => this.checkImagesLoaded(), 100);
        }
    }

    //actualiza el frame de la arco
    updateFrame(chargeRatio = 0) {
        if (!BowAssets.areImagesLoaded()) return;

        if (chargeRatio >= 0.66) {
            this.currentFrame = this.frames.frame3;
        } else if (chargeRatio >= 0.33) {
            this.currentFrame = this.frames.frame2;
        } else {
            this.currentFrame = this.frames.frame1;
        }
    }

    //dibuja la arco en el inventario
    drawInInventory(context, x, y, slotSize) {
        if (!BowAssets.areImagesLoaded()) return;

        const frame1 = this.frames.frame1;
        if (frame1 && frame1.complete) {
            const xOffset = (slotSize - this.inventorySize.width) / 2;
            const yOffset = (slotSize - this.inventorySize.height) / 2;
            try {
                context.drawImage(
                    frame1,
                    x + xOffset, y + yOffset,
                    this.inventorySize.width, this.inventorySize.height
                );
            } catch (error) {
                console.error("Error dibujando arco en inventario:", error);
            }
        }
    }

    //dibuja la arco en la mano
    drawInHand(context, playerX, playerY, cameraOffsetX = 0, cameraOffsetY = 0) {
        if (!BowAssets.areImagesLoaded() || !this.currentFrame || !this.currentFrame.complete) return;
    
        const handOffset = 15; // Distancia del arco al centro del jugador
    
        try {
            // Correccion para la posicion del arco
            const correction = 12;
            // Obtener la posición del mouse usando mouseControlls
            const mousePos = mouseControlls.getPosMouse();
    
            // Calcular el ángulo hacia el mouse
            const angle = Math.atan2(
                mousePos.posY - (playerY - cameraOffsetY),
                mousePos.posX - (playerX - cameraOffsetX)
            );
    
            // Calcular la posición del arco alrededor del jugador
            const bowX = playerX - cameraOffsetX + Math.cos(angle) * handOffset;
            const bowY = playerY + correction - cameraOffsetY + Math.sin(angle) * handOffset;
    
            // Calcular dimensiones
            const scale = this.handSize.height / this.currentFrame.height;
            let widthMultiplier = 1.5;
            if (this.currentFrame === this.frames.frame2) widthMultiplier = 1.1;
            if (this.currentFrame === this.frames.frame3) widthMultiplier = 1.2;
            const scaledWidth = this.currentFrame.width * scale * widthMultiplier;
    
            context.save();
    
            // Trasladar al punto del arco y rotar
            context.translate(bowX, bowY);
            context.rotate(angle);
    
            // Dibujar el arco con origen ajustado
            context.drawImage(
                this.currentFrame,
                -scaledWidth / 2,
                -this.handSize.height / 2,
                scaledWidth,
                this.handSize.height
            );
    
            context.restore();
        } catch (error) {
            console.error("Error dibujando arco en mano:", error);
        }
    }

    //obtiene la posicion del arco
    getBowPosition(playerX, playerY) {
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

    //inicia la carga de la arco
    startCharging() {
        if (!BowAssets.areImagesLoaded()) return false;
        
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
        if (!this.charging || !BowAssets.areImagesLoaded()) return null;

        const chargeTime = Date.now() - this.chargeStartTime;
        this.charge = Math.min(chargeTime, this.maxCharge);
        
        const chargeRatio = this.charge / this.maxCharge;
        const power = 15 + chargeRatio * 20;
        const gravity = 1.5 - chargeRatio * 1.3;
        
        const projectile = new Projectile(
            playerX - 10,
            playerY ,
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