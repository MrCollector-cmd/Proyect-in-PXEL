import { Rect } from "../../rect.js";
import { size } from "../../size.js";
import { controlls } from "../interacts/controlls.js";

function Player(x, y) {
    this.player = new Rect(x * size.tils, y * size.tils, 1 * size.tils - 5, 1 * size.tils - 5, 'solid');
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
    const speed = 10; // Velocidad horizontal
    const jumpSpeed = 10; // Velocidad vertical para el salto
    const maxJumpHeight = 150; // Altura máxima del salto
    const stepSize = 1; // Incremento del movimiento (píxeles por paso)
    let verticalMove = 0; // Movimiento vertical acumulado
    let horizontalMove = 0; // Movimiento horizontal acumulado

    // Manejar salto
    if (controlls.up && this.pCollButton && !this.isJumping) {
        this.isJumping = true;
        this.jumpHeight = 0;
        verticalMove = -jumpSpeed; // Iniciar el salto
    }

    if (this.isJumping) {
        if (this.jumpHeight < maxJumpHeight && !this.pCollTop) {
            verticalMove -= jumpSpeed; // Continuar el salto
            this.jumpHeight += jumpSpeed;
        } else {
            this.isJumping = false; // Dejar de saltar cuando se alcanza la altura máxima
        }
    }

    // Gravedad (si no está tocando el suelo o si no está saltando)
    if (!this.pCollButton && !this.isJumping) {
        verticalMove += speed; // Velocidad de caída cuando no está tocando el suelo
    }

    // Movimiento horizontal
    if (controlls.left && !this.pCollLeft) {
        horizontalMove -= speed;
    }
    if (controlls.right && !this.pCollRight) {
        horizontalMove += speed;
    }

    // Movimiento vertical: subdividir en pasos pequeños
    let targetY = yPos + verticalMove;

// Mover en pasos pequeños hasta que se alcance la posición objetivo
while (Math.abs(targetY - yPos) > 0.5) {
    let step = Math.sign(targetY - yPos) * stepSize; // Mover en la dirección correcta
    yPos += step;

    // Verificar colisiones durante cada paso
    if (verticalMove > 0 && this.pCollButton) { // Colisión con el suelo
        yPos = Math.floor(this.player.y + this.player.height); // Ajustar al borde superior del suelo
        verticalMove = 0; // Detener el movimiento vertical hacia abajo
        this.isJumping = false; // Terminar salto si está cayendo
        break;
    }
    if (verticalMove < 0 && this.pCollTop) { // Colisión con el techo
        yPos = Math.ceil(this.player.y - this.player.height); // Ajustar al borde inferior del techo
        verticalMove = 0; // Detener el movimiento vertical hacia arriba
        break;
    }
}

// Asegúrate de que la posición final es precisa tras salir del bucle
if (this.pCollButton && verticalMove > 0) {
    yPos = Math.floor(this.player.y + this.player.height); // Corregir al borde del suelo
    verticalMove = 0;
}
if (this.pCollTop && verticalMove < 0) {
    yPos = Math.ceil(this.player.y - this.player.height); // Corregir al borde del techo
    verticalMove = 0;
}

    // Movimiento horizontal: subdividir en pasos pequeños
    let targetX = xPos + horizontalMove;
    while (Math.abs(targetX - xPos) > 0.1) {
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

    // Actualizar la posición en el DOM directamente
    div.style.left = `${xPos}px`;
    div.style.top = `${yPos}px`;
    this.player.x = xPos;
    this.player.y = yPos;
};


// Método de actualización de colisiones
Player.prototype.refreshColl = function() {
    // Reiniciar las colisiones
    this.pCollButton = false;
    this.pCollTop = false;
    this.pCollLeft = false;
    this.pCollRight = false;
};

Player.prototype.distanceTo = function(map) {
    let posPlayerX = this.player.x - (this.player.width / 2);
    let posPlayerY = this.player.y - (this.player.height / 2);
    let targetX = map.x - (map.width / 2);
    let targetY = map.y - (map.height / 2);

    const distance = Math.sqrt(Math.pow(targetX - posPlayerX, 2) + Math.pow(targetY - posPlayerY, 2));
    return distance;
};

// Player.prototype.gravity = function (map) {
//     let div = document.getElementById(this.player.id);
//     if (!div) {
//         console.error("Element with the player's ID not found.");
//         return;
//     }

//     let yPos = parseInt(div.style.top, 10) || 0;
//     let fallSpeed = 10; // Velocidad de caída
//     let isAboveObject = false;
//     let closestObjectY = null;

    
//     // Movimiento píxel por píxel
//     for (let step = 1; step <= fallSpeed; step++) {
//         yPos += 1; // Avanzar un píxel hacia abajo

//         // Verificar si el jugador está directamente encima de un objeto
//         isAboveObject = false;
//         for (let target of map) {
//             if (
//                 this.player.x < target.x + target.width &&
//                 this.player.x + this.player.width > target.x &&
//                 yPos + this.player.height <= target.y &&
//                 yPos + this.player.height + 1 >= target.y // Detectar colisión exacta
//             ) {
//                 isAboveObject = true;
//                 closestObjectY = target.y;
//                 break;
//             }
//         }

//         if (isAboveObject) {
//             // Ajustar la posición al borde superior del objeto
//             yPos = closestObjectY - this.player.height;
//             this.pCollButton = true;
//             break; // Detener el movimiento
//         }
//     }
//     if (!isAboveObject) {
//         // Aplicar gravedad si no está tocando el suelo
//         this.pCollButton = false;
//     }

//     // Actualizar la posición del jugador
//     div.style.top = `${yPos-5}px`;
//     this.player.y = yPos;
// };

export { Player };