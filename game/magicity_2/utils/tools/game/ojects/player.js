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
    this.canJumpAgain = true;  // Bandera para controlar cuando el jugador puede saltar nuevamente
}
Player.prototype.move = function () {
    let div = document.getElementById(this.player.id);
    if (!div) {
        console.error("Element with the player's ID not found.");
        return;
    }

    let xPos = this.player.x;
    let yPos = this.player.y;
    const speed = 10;
    const jumpSpeed = 10;
    const maxJumpHeight = 160;
    const stepSize = 2;

    let verticalMove = 0;
    let horizontalMove = 0;

    // Manejar salto
    if (controlls.up && this.pCollButton && !this.isJumping && this.canJumpAgain) {
        this.isJumping = true;
        this.jumpHeight = 0;
        this.canJumpAgain = false
        verticalMove = -jumpSpeed;
    }

    if (this.isJumping) {
        if (this.jumpHeight < maxJumpHeight && !this.pCollTop) {
            verticalMove = -jumpSpeed;
            this.jumpHeight += jumpSpeed;
        } else {
            this.isJumping = false;
        }
    }

    // Gravedad
    if (!this.pCollButton && !this.isJumping) {
        verticalMove += 10; // Incremento por gravedad
    }

    // Limitar velocidad terminal
    const terminalVelocity = 20;
    if (verticalMove > terminalVelocity) {
        verticalMove = terminalVelocity;
    }

    // Movimiento horizontal
    if (controlls.left) {
        horizontalMove -= speed;
    }
    if (controlls.right) {
        horizontalMove += speed;
    }

    console.log(verticalMove)
// Movimiento vertical: subdividir en pasos más grandes
let targetY = yPos + verticalMove;

while (Math.abs(targetY - yPos) > stepSize) {
    let step = Math.sign(targetY - yPos) * Math.min(stepSize, Math.abs(targetY - yPos));
    yPos += step;

    // Detectar colisiones con objetos del mapa
    for (let obj of this.mapObjects) {
        if (obj.type === 'solid' && this.checkCollision(obj)) {
            console.log(verticalMove)
            console.log(verticalMove > 0)
            if (verticalMove > 0) { // Colisión hacia abajo
                yPos = obj.y - this.player.height; // Posicionar al jugador justo encima del rectángulo
                this.pCollButton = true;
                verticalMove = 0; // Detener el movimiento hacia abajo
            }

            if (verticalMove < 0) { // Colisión hacia arriba
                yPos = obj.y + this.player.height// Ajustar al borde inferior del objeto
                this.pCollTop = true;
                verticalMove = 0; // Detener el movimiento hacia arriba
            }
            break;
        }
    }
}
// Movimiento horizontal
    // Movimiento horizontal: subdividir en pasos pequeños
    let targetX = xPos + horizontalMove;
    while (Math.abs(targetX - xPos) > stepSize) {
        let step = Math.sign(targetX - xPos) * Math.min(stepSize, Math.abs(targetX - xPos));
        xPos += step;

        // Verificar colisiones horizontales
        if (this.pCollLeft && horizontalMove < 0) { // Colisión con la izquierda
            xPos -= step;
            break;
        }
        if (this.pCollRight && horizontalMove > 0) { // Colisión con la derecha
            xPos -= step;
            break;
        }
    }

    if(!controlls.up && this.canJumpAgain !== !this.canJumpAgain){
        this.canJumpAgain = true;
    }

    // Actualizar la posición en el DOM directamente
    div.style.left = `${xPos}px`;
    div.style.top = `${yPos}px`;
    this.player.x = xPos;
    this.player.y = yPos;
};

// Método de detección de colisiones
Player.prototype.checkCollision = function (obj) {
    return (
        this.player.x < obj.x + obj.width &&
        this.player.x + this.player.width > obj.x &&
        this.player.y < obj.y + obj.height &&
        this.player.y + this.player.height > obj.y
    );
};

// Método para calcular la distancia de solapamiento en Y
Player.prototype.calculateOverlapY = function (obj) {
    if (this.player.y + this.player.height > obj.y && this.player.y < obj.y) {
        return this.player.y + this.player.height - obj.y; // Solapamiento inferior
    }
    if (this.player.y < obj.y + obj.height && this.player.y + this.player.height > obj.y + obj.height) {
        return obj.y + obj.height - this.player.y; // Solapamiento superior
    }
    return 0;
};

// Método para calcular la distancia de solapamiento en X
Player.prototype.calculateOverlapX = function (obj) {
    if (this.player.x + this.player.width > obj.x && this.player.x < obj.x) {
        return this.player.x + this.player.width - obj.x; // Solapamiento izquierdo
    }
    if (this.player.x < obj.x + obj.width && this.player.x + this.player.width > obj.x + obj.width) {
        return obj.x + obj.width - this.player.x; // Solapamiento derecho
    }
    return 0;
};

// Método de actualización de colisiones
Player.prototype.refreshColl = function() {
    // Reiniciar las colisiones
    this.pCollButton = false;
    this.pCollTop = false;
    this.pCollLeft = false;
    this.pCollRight = false;
};

export { Player };