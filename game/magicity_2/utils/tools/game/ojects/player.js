import { Rect } from "../../rect.js"
import { size } from "../../size.js"
import { controlls } from "../interacts/controlls.js";
function Player(x,y){
    this.player = new Rect(x * size.tils,y * size.tils,1 * size.tils,1 * size.tils,'solid');
    this.hasMoved = false
    this.isJumping = false
    this.jumpHeight = 0;
    this.pCollTop = false;
    this.pCollButton = false;
    this.pCollRight = false;
    this.pCollLeft = false;
    this.mapObjects
}
Player.prototype.move = function() {
    let div = document.getElementById(this.player.id);
    if (!div) {
        console.error("Element with the player's ID not found.");
        return;
    }

    let xPos = parseInt(div.style.left, 10) || 0;
    let yPos = parseInt(div.style.top, 10) || 0;
    const speed = 10; // Velocidad de movimiento
    const jumpSpeed = 10; // Velocidad de salto
    const maxJumpHeight = 2 * size.tils; // Altura máxima del salto

    let hasMoved = false;

    // Manejar el salto
    if (controlls.up && !this.isJumping && this.pCollButton && !controlls.pushUp) {
        this.isJumping = true;
        controlls.pushUp = true;
        this.jumpHeight = 0;
    }

    if (this.isJumping) {
        if (this.jumpHeight < maxJumpHeight && !this.pCollTop) {
            yPos -= jumpSpeed;
            this.jumpHeight += jumpSpeed;
            hasMoved = true;
        } else {
            this.isJumping = false;
        }
    }

    // Gravedad: Si no está saltando y no hay colisión abajo
    if (!this.isJumping && !this.pCollButton) {
        yPos += speed; // Aplicar gravedad
        hasMoved = true;
    }

    // Restablecer el control de salto cuando se suelta la tecla
    if (!controlls.up) {
        controlls.pushUp = false;
    }

    // Movimiento hacia la izquierda (con pasos)
    if (controlls.left && !this.pCollLeft) {
        let canMoveLeft = true;
        for (let obj of this.mapObjects) {
            const distance = this.distanceTo(obj);
            // Revisar si el jugador se está moviendo hacia la izquierda y si hay una colisión
            if (distance <= this.player.width && obj.x < this.player.x) {
                // Detectar si va a atravesar un objeto
                const potentialX = xPos - speed;
                if (potentialX < obj.x + obj.width) {
                    // Detener el movimiento al límite
                    xPos = obj.x + obj.width;
                    canMoveLeft = false;
                    break;
                }
            }
        }

        // Si no hay colisión, mover en pasos pequeños
        if (canMoveLeft) {
            xPos -= speed;
            hasMoved = true;
        }
    }

    // Movimiento hacia la derecha (con pasos)
    if (controlls.right && !this.pCollRight) {
        let canMoveRight = true;
        for (let obj of this.mapObjects) {
            const distance = this.distanceTo(obj);
            // Revisar si el jugador se está moviendo hacia la derecha y si hay una colisión
            if (distance <= this.player.width && obj.x > this.player.x) {
                // Detectar si va a atravesar un objeto
                const potentialX = xPos + speed;
                if (potentialX + this.player.width > obj.x) {
                    // Detener el movimiento al límite
                    xPos = obj.x - this.player.width;
                    canMoveRight = false;
                    break;
                }
            }
        }

        // Si no hay colisión, mover en pasos pequeños
        if (canMoveRight) {
            xPos += speed;
            hasMoved = true;
        }
    }

    // Si se movió, verificar las colisiones y corregir la posición
    if (hasMoved) {
        this.refreshColl(); // Refrescar estado de colisiones

        // Corrección de posición si hay colisión
        if (this.pCollButton) {
            // Alinear con la plataforma
            yPos = Math.floor(yPos / size.tils) * size.tils;
            this.isJumping = false; // Detener el salto
        } else if (this.pCollTop) {
            // Ajustar al techo
            yPos = Math.ceil(yPos / size.tils) * size.tils + size.tils;
        }

        if (this.pCollLeft) {
            // Ajustar a la izquierda y permitir deslizamiento hacia abajo
            xPos = Math.ceil(xPos / size.tils) * size.tils + size.tils;
            if (!this.pCollButton) yPos += speed; // Deslizar hacia abajo si no hay soporte
        } else if (this.pCollRight) {
            // Ajustar a la derecha y permitir deslizamiento hacia abajo
            xPos = Math.floor(xPos / size.tils) * size.tils;
            if (!this.pCollButton) yPos += speed; // Deslizar hacia abajo si no hay soporte
        }

        // Actualizar la posición del jugador
        div.style.left = `${xPos}px`;
        div.style.top = `${yPos}px`;
        this.player.x = xPos;
        this.player.y = yPos;
    }
};
// ?///////////////// aca esta el problema ///////////////////
Player.prototype.refreshColl = function(){
    this.pCollButton = false
    this.pCollTop = false
    this.pCollLeft = false
    this.pCollRight = false
} 
Player.prototype.distanceTo = function(map) {
    let posPlayerX = this.player.x - (this.player.width / 2);
    let posPlayerY = this.player.y - (this.player.height / 2);
    let targetX = map.x - (map.width / 2);
    let targetY = map.y - (map.height / 2);

    const distance = Math.sqrt(Math.pow(targetX - posPlayerX, 2) + Math.pow(targetY - posPlayerY, 2));
    
    return distance;
}
Player.prototype.gravity = function(map) {
    let div = document.getElementById(this.player.id);
    if (!div) {
        console.error("Element with the player's ID not found.");
        return;
    }
    let yPos = parseInt(div.style.top, 10) || 0;
    let isAboveObject = false;
    if (Array.isArray(map)) {
        for (let i = 0; i < map.length; i++) {
            let target = map[i];
            let distance  = this.distanceTo(target);
            
            if (distance === 0 && target.y > this.player.y && target.y < this.player.y + this.player.height) {
                isAboveObject = true;
            }
            break;
        };
    }
    // Function to handle gravity
    const applyGravity = () => {
        // Check if the player is in movement and if there is no collision below
        if (!isAboveObject && !this.pCollButton) {
            // If the player is within the bounds, apply gravity
            if (yPos >= 0 && yPos < size.height - 1 * size.tils) {
                yPos += 1; // Gravity speed
                div.style.top = `${yPos}px`;
                this.player.y = yPos;
            }
        }
    };

    // Call the gravity function
    applyGravity();
};


export {Player}