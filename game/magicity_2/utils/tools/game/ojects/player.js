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

Player.prototype.move = function() {
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
    let verticalMove = 0; // Movimiento vertical acumulado
    let horizontalMove = 0; // Movimiento horizontal acumulado

    // Manejar el salto solo si el jugador está tocando el suelo
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
            this.isJumping = false; // El salto terminó
        }
    }

    // Movimiento horizontal
    if (controlls.left && !this.pCollLeft) {
        horizontalMove -= speed;
    }

    if (controlls.right && !this.pCollRight) {
        horizontalMove += speed;
    }

    // Aplicar gravedad si no está tocando el suelo y no está saltando
    if (!this.pCollButton && !this.isJumping) {
        verticalMove += 9; // Velocidad de caída
    }

    // Actualizar colisiones antes de ajustar la posición
    this.refreshColl();

    // Ajuste del movimiento vertical
    yPos += verticalMove;
    if (this.pCollButton && verticalMove > 0) {
        yPos = Math.floor(yPos / size.tils) * size.tils; // Alinear con el suelo
        verticalMove = 0; // Detener el movimiento vertical
    }
    if (this.pCollTop && verticalMove < 0) {
        yPos = Math.ceil(yPos / size.tils) * size.tils + this.player.height; // Alinear con el techo
        verticalMove = 0;
    }

    // Actualizar colisiones tras el movimiento vertical
    this.refreshColl();

    // Ajuste del movimiento horizontal
    xPos += horizontalMove;
    if (this.pCollLeft && horizontalMove < 0) {
        xPos = Math.ceil(xPos / size.tils) * size.tils + size.tils; // Alinear con el lado derecho del objeto a la izquierda
        horizontalMove = 0;
    }
    if (this.pCollRight && horizontalMove > 0) {
        xPos = Math.floor(xPos / size.tils) * size.tils - this.player.width; // Alinear con el lado izquierdo del objeto a la derecha
        horizontalMove = 0;
    }

    // Actualizar posición en el DOM
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

    // Detectar colisiones con los objetos del mapa
    for (let obj of this.mapObjects) {
        // Colisión con el suelo (debajo del jugador)
        if (
            this.player.x < obj.x + obj.width &&
            this.player.x + this.player.width > obj.x &&
            this.player.y + this.player.height <= obj.y &&
            this.player.y + this.player.height + 1 >= obj.y
        ) {
            this.pCollButton = true;  // El jugador está tocando el suelo
        }

        // Colisión con la parte superior (encima del jugador)
        if (
            this.player.x < obj.x + obj.width &&
            this.player.x + this.player.width > obj.x &&
            this.player.y >= obj.y + obj.height &&
            this.player.y - 1 <= obj.y + obj.height
        ) {
            this.pCollTop = true;
        }

        // Colisión con la izquierda (lado izquierdo del jugador tocando el lado derecho del objeto)
        if (
            this.player.y < obj.y + obj.height &&
            this.player.y + this.player.height > obj.y &&
            this.player.x >= obj.x + obj.width &&
            this.player.x - 1 <= obj.x + obj.width
        ) {
            this.pCollLeft = true;
        }

        // Colisión con la derecha (lado derecho del jugador tocando el lado izquierdo del objeto)
        if (
            this.player.y < obj.y + obj.height &&
            this.player.y + this.player.height > obj.y &&
            this.player.x + this.player.width <= obj.x &&
            this.player.x + this.player.width + 1 >= obj.x
        ) {
            this.pCollRight = true;
        }
    }
};

// Método de actualización de colisiones
Player.prototype.refreshColl = function() {
    // Reiniciar las colisiones
    this.pCollButton = false;
    this.pCollTop = false;
    this.pCollLeft = false;
    this.pCollRight = false;

    // Detectar colisiones con los objetos del mapa
    for (let obj of this.mapObjects) {
        // Colisión con el suelo (debajo del jugador)
        if (
            this.player.x < obj.x + obj.width &&
            this.player.x + this.player.width > obj.x &&
            this.player.y + this.player.height <= obj.y &&
            this.player.y + this.player.height + 1 >= obj.y
        ) {
            this.pCollButton = true;  // El jugador está tocando el suelo
        }

        // Colisión con la parte superior (encima del jugador)
        if (
            this.player.x < obj.x + obj.width &&
            this.player.x + this.player.width > obj.x &&
            this.player.y >= obj.y + obj.height &&
            this.player.y - 1 <= obj.y + obj.height
        ) {
            this.pCollTop = true;
        }

        // Colisión con la izquierda (lado izquierdo del jugador tocando el lado derecho del objeto)
        if (
            this.player.y < obj.y + obj.height &&
            this.player.y + this.player.height > obj.y &&
            this.player.x >= obj.x + obj.width &&
            this.player.x - 1 <= obj.x + obj.width
        ) {
            this.pCollLeft = true;
        }

        // Colisión con la derecha (lado derecho del jugador tocando el lado izquierdo del objeto)
        if (
            this.player.y < obj.y + obj.height &&
            this.player.y + this.player.height > obj.y &&
            this.player.x + this.player.width <= obj.x &&
            this.player.x + this.player.width + 1 >= obj.x
        ) {
            this.pCollRight = true;
        }
    }
};

Player.prototype.distanceTo = function(map) {
    let posPlayerX = this.player.x - (this.player.width / 2);
    let posPlayerY = this.player.y - (this.player.height / 2);
    let targetX = map.x - (map.width / 2);
    let targetY = map.y - (map.height / 2);

    const distance = Math.sqrt(Math.pow(targetX - posPlayerX, 2) + Math.pow(targetY - posPlayerY, 2));
    return distance;
};

Player.prototype.gravity = function(map) {
    let div = document.getElementById(this.player.id);
    if (!div) {
        console.error("Element with the player's ID not found.");
        return;
    }

    let yPos = parseInt(div.style.top, 10) || 0;
    let isAboveObject = false;
    let closestObjectY = null;

    if (Array.isArray(map)) {
        for (let target of map) {
            // Verificar si el jugador está directamente encima del objeto
            if (
                this.player.x < target.x + target.width &&
                this.player.x + this.player.width > target.x &&
                yPos + this.player.height <= target.y &&
                yPos + this.player.height + 10 >= target.y
            ) {
                isAboveObject = true;
                closestObjectY = target.y;
                break;
            }
        }
    }

    if (isAboveObject) {
        // Si está encima de un objeto, ajustar la posición al borde superior del objeto
        yPos = closestObjectY - this.player.height;
        this.pCollButton = true;
    } else {
        // Aplicar gravedad si no está tocando el suelo
        yPos += 10; // Velocidad de caída
        this.pCollButton = false;
    }

    // Actualizar la posición del jugador
    div.style.top = `${yPos}px`;
    this.player.y = yPos;
};

export { Player };