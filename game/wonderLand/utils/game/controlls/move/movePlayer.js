import {controlls} from '../controlls.js'
import { size } from "../../../configs/size.js";
function willCollide(x, y, obj, player) {
    return (
        x < obj.x + obj.width &&            // Verifica si el jugador está a la izquierda del objeto
        x + player.width > obj.x &&    // Verifica si el jugador está a la derecha del objeto
        y < obj.y + obj.height &&           // Verifica si el jugador está arriba del objeto
        y + player.height > obj.y      // Verifica si el jugador está abajo del objeto
    );
};
function move(player){
    refreshColl(player)
    const speed = 10; // Velocidad de movimiento horizontal
    const jumpForce = -20; // Fuerza del salto
    const gravity = 1.5; // Aceleración de la gravedad
    const maxFallSpeed = 15; // Velocidad máxima de caída

    // Manejar salto
    if (controlls.up) {
        if (player.pCollButton && player.canJump) {
            player.velocityY = jumpForce; // Aplicar fuerza de salto a la velocidad vertical
            player.isJumping = true; // Activar el estado de salto
            player.canJump = false; // Desactivar la capacidad de saltar
        }
    } else {
        // Solo permite saltar de nuevo cuando suelta la tecla
        player.canJump = true;
    }

    // Aplicar gravedad
    if (!player.pCollButton) {
        player.velocityY += gravity; // Aplicar gravedad a la velocidad vertical
        if (player.velocityY > maxFallSpeed) {
            player.velocityY = maxFallSpeed; // Limitar la velocidad de caída
        }
    }

    // Movimiento horizontal
    let moveX = 0;
    if (controlls.left && !player.pCollLeft) moveX -= speed;   // Mueve hacia la izquierda si se presiona la tecla izquierda y no hay colisión con la izquierda
    if (controlls.right && !player.pCollRight) moveX += speed; // Mueve hacia la derecha si se presiona la tecla derecha y no hay colisión con la derecha

    // Aplicar movimiento horizontal
    let newX = player.x + moveX;           // Actualiza la posición horizontal
    let newY = player.y + player.velocityY;  // Actualiza la posición vertical

    // Verificar colisiones
    let isOnGround = false;
    for (let obj of player.mapObjects) {          // Itera sobre los objetos del mapa
        if (obj.type === 'solid') {
            // Verifica si hay colisión en Y
            if (willCollide(player.x, newY, obj,player)) {
                if (player.velocityY > 0) {   // Cayendo
                    newY = obj.y - player.height;  // Actualiza la posición vertical para evitar caer dentro del objeto
                    player.velocityY = 0;
                    player.pCollButton = true;
                    isOnGround = true;
                    player.isJumping = false;
                } else if (player.velocityY < 0) {    // Subiendo
                    newY = obj.y + obj.height;      
                    player.velocityY = 0;
                    player.pCollTop = true;
                }
            }

            // Verificar colisión en X
            if (willCollide(newX, player.y, obj, player)) {
                if (moveX > 0) {  
                    newX = obj.x - player.width;
                    player.pCollRight = true;
                } else if (moveX < 0) {
                    newX = obj.x + obj.width;
                    player.pCollLeft = true;
                }
            }
        }
    }

    if (!isOnGround) { // Si no está en el suelo
        player.pCollButton = false; // Desactiva la colisión con el suelo
    }

    // Actualizar posición del jugador y del div
    player.x = newX; 
    player.y = newY; 

}


// Reinicia las colisiones
function refreshColl (player) {
    player.pCollTop = false; 
    player.pCollLeft = false;
    player.pCollRight = false;
};

export {move}