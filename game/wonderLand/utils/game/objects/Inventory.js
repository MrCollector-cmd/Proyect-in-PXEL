import { Item } from './Item.js';

class Inventory {
    constructor() {
        this.items = new Array(20).fill(null);
        this.slots = 20;
        this.slotSize = 65;
        this.padding = 12;
        this.isOpen = false;
        this.selectedItem = null;

        // Agregar algunos items de prueba
        this.addItem(new Item(1, "Cubo Azul", "test"));
        this.addItem(new Item(2, "Cubo Azul", "test"));
        this.addItem(new Item(3, "Cubo Azul", "test"));

        // Agregar event listener para clicks
        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                this.handleClick(e.clientX, e.clientY);
            }
        });
    }

    handleClick(mouseX, mouseY) {
        if (!this.isOpen) return;

        const rows = 5;
        const cols = 4;
        const startX = this.padding * 2;
        const startY = (window.innerHeight - ((rows * this.slotSize) + ((rows + 1) * this.padding))) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + this.padding + (col * (this.slotSize + this.padding));
                const y = startY + this.padding + (row * (this.slotSize + this.padding));
                
                if (mouseX >= x && mouseX <= x + this.slotSize &&
                    mouseY >= y && mouseY <= y + this.slotSize) {
                    const slotIndex = row * cols + col;
                    this.toggleEquipItem(slotIndex);
                    return;
                }
            }
        }
    }

    toggleEquipItem(slotIndex) {
        const item = this.items[slotIndex];
        if (!item) return;

        // Si el item ya está equipado, lo desequipamos
        if (item.isEquipped) {
            item.isEquipped = false;
            this.selectedItem = null;
            return;
        }

        // Desequipar todos los demás items
        this.items.forEach(otherItem => {
            if (otherItem) otherItem.isEquipped = false;
        });

        // Equipar el nuevo item
        item.isEquipped = true;
        this.selectedItem = item;
    }

    drawEquippedItem(context, playerX, playerY, offsetX, offsetY) {
        if (this.selectedItem) {
            this.selectedItem.drawInHand(context, playerX, playerY, offsetX, offsetY);
        }
    }

    addItem(item) {
        if (item.stackable) {
            const existingSlot = this.items.findIndex(slot => 
                slot && slot.id === item.id && slot.quantity < slot.maxStack
            );
            if (existingSlot !== -1) {
                this.items[existingSlot].quantity++;
                return true;
            }
        }

        const emptySlot = this.items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.items[emptySlot] = item;
            return true;
        }
        return false;
    }

    removeItem(slotIndex) {
        if (this.items[slotIndex]) {
            if (this.items[slotIndex].stackable && this.items[slotIndex].quantity > 1) {
                this.items[slotIndex].quantity--;
            } else {
                this.items[slotIndex] = null;
            }
            return true;
        }
        return false;
    }

    draw(context) {
        if (!this.isOpen) return;

        const rows = 5;
        const cols = 4;
        const inventoryWidth = (cols * this.slotSize) + ((cols + 1) * this.padding);
        const inventoryHeight = (rows * this.slotSize) + ((rows + 1) * this.padding);
        
        const startX = this.padding * 2;
        const startY = (context.canvas.height - inventoryHeight) / 2;

        // Dibujar fondo del inventario
        context.fillStyle = 'rgba(50, 50, 50, 0.9)';
        context.fillRect(startX, startY, inventoryWidth, inventoryHeight);

        // Dibujar slots e items
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const slotIndex = row * cols + col;
                const x = startX + this.padding + (col * (this.slotSize + this.padding));
                const y = startY + this.padding + (row * (this.slotSize + this.padding));
                
                // Dibujar slot
                context.fillStyle = 'rgba(70, 70, 70, 0.8)';
                context.fillRect(x, y, this.slotSize, this.slotSize);
                context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                context.strokeRect(x, y, this.slotSize, this.slotSize);

                // Dibujar item si existe en este slot
                const item = this.items[slotIndex];
                if (item) {
                    item.draw(context, x, y, this.slotSize);
                }
            }
        }
    }
}

export { Inventory }; 