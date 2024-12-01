import { Rect } from "../../rect.js";
import { size } from "../../size.js";
import { controlls } from "../interacts/controlls.js";

function Player(x, y) {
    this.player = new Rect(x * size.tils , y * size.tils , 50 , 50, 'solid');
    this.isJumping = false;  // Indica si el jugador está saltando
    this.jumpHeight = 0;     // Altura del salto
    this.pCollTop = false;   // Colisión superior
    this.pCollButton = false; // Colisión con el suelo
    this.pCollRight = false;  // Colisión con la derecha
    this.pCollLeft = false;   // Colisión con la izquierda
    this.mapObjects = [];     // Objetos con los que el jugador puede chocar
    this.velocityY = 0;        // Velocidad vertical
    this.canJump = true;       // Indica si puede saltar (debe soltar la tecla primero)
}

Player.prototype.move = function () {
    let div = document.getElementById(this.player.id);
    if (!div) {
        console.error("Element with the player's ID not found.");
        return;
    }    

    const speed = 10; // Velocidad de movimiento horizontal
    const jumpForce = -20; // Fuerza del salto
    const gravity = 1.5; // Aceleración de la gravedad
    const maxFallSpeed = 15; // Velocidad máxima de caída

    // Manejar salto
    if (controlls.up) {
        if (this.pCollButton && this.canJump) {
            this.velocityY = jumpForce; // Aplicar fuerza de salto a la velocidad vertical
            this.isJumping = true; // Activar el estado de salto
            this.canJump = false; // Desactivar la capacidad de saltar
        }
    } else {
        // Solo permite saltar de nuevo cuando suelta la tecla
        this.canJump = true;
    }

    // Aplicar gravedad
    if (!this.pCollButton) {
        this.velocityY += gravity; // Aplicar gravedad a la velocidad vertical
        if (this.velocityY > maxFallSpeed) {
            this.velocityY = maxFallSpeed; // Limitar la velocidad de caída
        }
    }

    // Movimiento horizontal
    let moveX = 0;
    if (controlls.left && !this.pCollLeft) moveX -= speed;   // Mueve hacia la izquierda si se presiona la tecla izquierda y no hay colisión con la izquierda
    if (controlls.right && !this.pCollRight) moveX += speed; // Mueve hacia la derecha si se presiona la tecla derecha y no hay colisión con la derecha

    // Aplicar movimiento horizontal
    let newX = this.player.x + moveX;           // Actualiza la posición horizontal
    let newY = this.player.y + this.velocityY;  // Actualiza la posición vertical

    // Verificar colisiones
    let isOnGround = false;
    for (let obj of this.mapObjects) {          // Itera sobre los objetos del mapa
        if (obj.type === 'solid') {
            // Verifica si hay colisión en Y
            if (this.willCollide(this.player.x, newY, obj)) {
                if (this.velocityY > 0) {   // Cayendo
                    newY = obj.y - this.player.height;  // Actualiza la posición vertical para evitar caer dentro del objeto
                    this.velocityY = 0;
                    this.pCollButton = true;
                    isOnGround = true;
                    this.isJumping = false;
                } else if (this.velocityY < 0) {    // Subiendo
                    newY = obj.y + obj.height;      
                    this.velocityY = 0;
                    this.pCollTop = true;
                }
            }

            // Verificar colisión en X
            if (this.willCollide(newX, this.player.y, obj)) {
                if (moveX > 0) {  
                    newX = obj.x - this.player.width;
                    this.pCollRight = true;
                } else if (moveX < 0) {
                    newX = obj.x + obj.width;
                    this.pCollLeft = true;
                }
            }
        }
    }

    if (!isOnGround) { // Si no está en el suelo
        this.pCollButton = false; // Desactiva la colisión con el suelo
    }

    // Actualizar posición del jugador y del div
    this.player.x = newX; 
    this.player.y = newY; 
    div.style.left = `${newX}px`; 
    div.style.top = `${newY}px`; 
};

Player.prototype.willCollide = function(x, y, obj) {
    return (
        x < obj.x + obj.width &&            // Verifica si el jugador está a la izquierda del objeto
        x + this.player.width > obj.x &&    // Verifica si el jugador está a la derecha del objeto
        y < obj.y + obj.height &&           // Verifica si el jugador está arriba del objeto
        y + this.player.height > obj.y      // Verifica si el jugador está abajo del objeto
    );
};

// Comprueba si hay colisión
Player.prototype.checkCollision = function (obj) {
    return this.willCollide(this.player.x, this.player.y, obj);
};

// Reinicia las colisiones
Player.prototype.refreshColl = function() {
    this.pCollTop = false; 
    this.pCollLeft = false;
    this.pCollRight = false;
};

export { Player };