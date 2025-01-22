class Item {
    constructor(id, name, type,obj) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.obj = obj
        this.quantity = 1;
        this.isEquipped = false;
    }

    updateFrame(chargeRatio = 0) {
        if (this.obj) {
            this.obj.updateFrame(chargeRatio);
        }
    }

    draw(context, x, y, size) {
        if (this.isEquipped) {
            context.strokeStyle = 'black';
            context.lineWidth = 3;
            context.strokeRect(x, y, size, size);
            context.lineWidth = 1;
            this.obj.drawInInventory(context, x, y, size);
        }

        if (!this.isEquipped) {
            this.obj.drawInInventory(context, x, y, size);
        }

        if (this.quantity > 1) {
            context.fillStyle = 'white';
            context.font = '12px Arial';
            context.fillText(this.quantity, x + size - 15, y + size - 5);
        }
    }

    drawInHand(context, x, y, offsetX, offsetY) {
        if (this.isEquipped) {
            this.obj.drawInHand(context, x, y, offsetX, offsetY);
        }
    }
}

export { Item };