class Item {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.quantity = 1;
        this.isEquipped = false;
    }

    draw(context, x, y, size) {
        // Dibujar un cubo azul simple
        context.fillStyle = 'rgba(0, 100, 255, 0.8)';
        context.fillRect(x + 5, y + 5, size - 10, size - 10);
        
        // Si está equipado, agregar un borde dorado
        context.strokeStyle = this.isEquipped ? 'gold' : 'white';
        context.lineWidth = this.isEquipped ? 3 : 1;
        context.strokeRect(x + 5, y + 5, size - 10, size - 10);
        context.lineWidth = 1;

        if (this.quantity > 1) {
            context.fillStyle = 'white';
            context.font = '12px Arial';
            context.fillText(this.quantity, x + size - 15, y + size - 5);
        }
    }

    drawInHand(context, x, y, offsetX, offsetY) {
        if (this.isEquipped) {
            const size = 30;
            context.fillStyle = 'rgba(0, 100, 255, 0.8)';
            context.fillRect(x - offsetX + 40, y - offsetY + 20, size, size);
            context.strokeStyle = 'white';
            context.strokeRect(x - offsetX + 40, y - offsetY + 20, size, size);
        }
    }
}

export { Item };