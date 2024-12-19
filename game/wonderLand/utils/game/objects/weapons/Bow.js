import { imagesController } from "../../../configs/imagesController.js";

class Bow {
    constructor() {
        this.frames = {
            frame1: imagesController.loadImage("src/weapons/BowFrame1.png"),
            frame2: imagesController.loadImage("src/weapons/BowFrame2.png"),
            frame3: imagesController.loadImage("src/weapons/BowFrame3.png")
        };
        this.currentFrame = this.frames.frame1;
        
        // Ajustamos las proporciones del inventario
        this.inventorySize = {
            width: 25,    // Más delgado
            height: 55    // Más alto
        };
        this.handSize = {
            width: 15,
            height: 60
        };
        
        this.anchorPoints = {
            right: {
                x: 60,  // Volvemos al valor original
                y: 10
            },
            left: {
                x: -10,
                y: 10
            }
        };
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
        if (this.currentFrame && this.currentFrame.complete) {
            context.save();
            
            // Ajustamos la posición para que coincida con la mano del personaje
            const handOffsetX = 26;
            const handOffsetY = 15;
            
            const imgWidth = this.currentFrame.width;
            const imgHeight = this.currentFrame.height;
            
            // Calculamos la escala base para la altura
            const scale = this.handSize.height / imgHeight;
            
            // Reducimos los multiplicadores para una expansión más sutil
            let widthMultiplier = 1;
            if (this.currentFrame === this.frames.frame2) {
                widthMultiplier = 1.1;  // Reducido de 1.3 a 1.1
            } else if (this.currentFrame === this.frames.frame3) {
                widthMultiplier = 1.2;  // Reducido de 1.6 a 1.2
            }
            
            const scaledWidth = imgWidth * scale * widthMultiplier;
            
            // Ajustamos la posición para que se expanda desde atrás
            const adjustedX = x - offsetX + handOffsetX - scaledWidth;
            const adjustedY = y - offsetY + handOffsetY - this.handSize.height/2;
            
            context.drawImage(
                this.currentFrame,
                adjustedX,
                adjustedY,
                scaledWidth,
                this.handSize.height
            );
            
            context.restore();
        }
    }
}

export { Bow }; 