import { imagesController } from "../../../configs/imagesController.js";
import { size } from "../../../configs/size.js";

class inventory {
    constructor() {
        this.items = new Array(20).fill(null);
        this.slots = 20;
        this.slotSize = size.tils;
        this.padding = 12;
        this.isOpen = false;
        this.selectedItem = null;
        // Ruta de la imagen del fondo del inventario
        this.backgroundImagePath = 'src/ui/inventory.png';
        // Pre-cargar la imagen del fondo
        imagesController.loadImage(this.backgroundImagePath);

        addEventListener('click',event=>{
            if (this.isOpen) {
                this.handleClick(event.clientX, event.clientY);
            }
        })
    }

    handleClick(mouseX, mouseY) {
        if (!this.isOpen) return;
        const rows = 5;
        const cols = 4;
    
        // Calcular dimensiones y posición inicial del inventario
        const inventoryHeight = ((rows + 1) * this.slotSize) + ((rows + size.tils * 0.093) * this.padding);
        const startX = this.padding * 2;
        const startY = (window.innerHeight - inventoryHeight) / 2;
    
        // Iterar por cada slot y comprobar si el clic está dentro
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + this.padding + (col * (this.slotSize + this.padding));
                const y = startY + this.padding + ((row + size.tils * 0.03) * (this.slotSize + (this.padding - 3)));
    
                if (
                    mouseX >= x && mouseX <= x + this.slotSize &&
                    mouseY >= y && mouseY <= y + this.slotSize
                ) {
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

    draw(context,player) {
        if (!this.isOpen) return;
        const rows = 5;
        const cols = 4;
        const inventoryWidth = (cols * this.slotSize) + ((cols + 1) * this.padding);
        const inventoryHeight = ((rows+1) * this.slotSize) + ((rows+size.tils*0.093) * this.padding);
        
        const startX = this.padding * 2;
        const startY = (context.canvas.height - inventoryHeight) / 2;

        // Obtener la imagen desde el controlador de imágenes
        const backgroundImage = imagesController.getImage(this.backgroundImagePath);

        // Dibujar fondo del inventario solo si la imagen está cargada
        if (backgroundImage && backgroundImage.complete && backgroundImage.width !== 0) {
            context.drawImage(backgroundImage, startX, startY, inventoryWidth, inventoryHeight);
        } else {
            // Opcional: dibujar un marcador de posición mientras la imagen se carga
            context.fillStyle = 'rgba(50, 50, 50, 0.9)';
            context.fillRect(startX, startY, inventoryWidth, inventoryHeight); 
        }
        // Dibujar slots e items
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const slotIndex = row * cols + col;
                const x = startX + this.padding + (col * (this.slotSize + this.padding));
                const y = startY + this.padding + ((row + size.tils*0.03) * (this.slotSize + (this.padding - 3)));
                
                // // Dibujar slot
                // context.fillStyle = 'rgba(70, 70, 70, 0.8)';
                // context.fillRect(x, y, this.slotSize, this.slotSize);
                // context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                // context.strokeRect(x, y, this.slotSize, this.slotSize);

                // Dibujar item si existe en este slot
                const item = this.items[slotIndex];
                if (item) {
                    item.draw(context, x, y, this.slotSize);
                }
            }
        }
        // mouseControlls.handleClick().then((event) => {
        //     this.handleClick(event.clientX, event.clientY);
        // });
        // // Comprobar si hay algún objeto con isEquiped
        
        const isAnyEquipped = this.items.find(item => item?.isEquipped);
        if (isAnyEquipped) {
            player.equipped = isAnyEquipped
        }else{
            player.equipped = false
        }
        
    }
}

export { inventory }; 