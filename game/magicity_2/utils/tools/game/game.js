import { collsObjects } from "./interacts/collsObjects.js";
import { Map } from "./ojects/map.js";
import { size } from "../size.js";

function Game(player) {
    let downMap = new Map();
    this.p = player;

    // Inicializar el primer chunk
    downMap.initialize();
    this.map = downMap.createAndDraw();

    // Avanzar y agregar más chunks si es necesario
    downMap.advanceChunk();
    this.map = this.map.concat(downMap.map);

    downMap.advanceChunk();
    this.map = this.map.concat(downMap.map);

    downMap.advanceChunk();
    this.map = this.map.concat(downMap.map);

    // Asignar los objetos de colisión al jugador
    this.p.mapObjects = this.map;
    this.p.gravity(this.map);

    // Configurar la detección de colisiones
    collsObjects.pla = this.p;
    collsObjects.map = this.map;
    collsObjects.checkCollision();

    // Actualizar el estado del jugador y el mapa después de las colisiones
    this.p = collsObjects.pla;
    this.map = collsObjects.map;

    // Seleccionar el contenedor del mundo del juego
    const gameWorld = document.getElementById("game-world");


    // Función para actualizar la vista centrada en el jugador
    this.updateView = () => {
        let playerX = this.p.player.x;
        let playerY = this.p.player.y;
        // Calcular la posición central de la pantalla
        let halfScreenWidth = window.innerWidth / 2;
        let halfScreenHeight = window.innerHeight / 2;

        // Mover la cámara solo si el jugador está a la mitad de la pantalla
        let translateX = 0;
        let translateY = 0;
       // Solo mover la cámara cuando el jugador está más allá de la mitad de la pantalla
       if (playerX > halfScreenWidth) {
        translateX = -(playerX - halfScreenWidth); // Centrar al jugador en X
    }

    if (playerY > halfScreenHeight && playerY < window.innerHeight) {
        translateY = -(playerY - halfScreenHeight); // Centrar al jugador en Y
    }
        // Verifica si la transformación está funcionando
        
        // Asegúrate de que estamos aplicando el transform correctamente
        gameWorld.style.transition = "transform 0.1s ease";  // Esto asegura una transición suave
        gameWorld.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    // Llamar a updateView continuamente para actualizar la vista
    const gameLoop = () => {
        this.updateView();
        requestAnimationFrame(gameLoop);
    };

    gameLoop();
}

export { Game };