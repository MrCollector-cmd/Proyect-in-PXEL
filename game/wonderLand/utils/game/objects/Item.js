import { Bow } from "./weapons/Bow.js";

class Item {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.quantity = 1;
        this.isEquipped = false;
        this.weapon = type === "test" ? new Bow() : null;
    }

    updateFrame(chargeRatio = 0) {
        if (this.weapon) {
            this.weapon.updateFrame(chargeRatio);
        }
    }

    draw(context, x, y, size) {
        if (this.isEquipped) {
            context.strokeStyle = 'gold';
            context.lineWidth = 3;
            context.strokeRect(x, y, size, size);
            context.lineWidth = 1;
        }

        if (this.weapon) {
            this.weapon.drawInInventory(context, x, y, size);
        }

        if (this.quantity > 1) {
            context.fillStyle = 'white';
            context.font = '12px Arial';
            context.fillText(this.quantity, x + size - 15, y + size - 5);
        }
    }

    drawInHand(context, x, y, offsetX, offsetY) {
        if (this.isEquipped && this.weapon) {
            this.weapon.drawInHand(context, x, y, offsetX, offsetY);
        }
    }
}

export { Item };