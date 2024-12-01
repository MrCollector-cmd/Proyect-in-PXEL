import { collsObjects } from "./interacts/collsObjects.js";
import { Map } from "./ojects/map.js";
function Game(player) {
    let downMap = new Map();
    this.p = player;

    // Inicializar el primer chunk
    downMap.initialize();
    this.map = downMap.createAndDraw();

    // Cargar más chunks si es necesario
    for (let i = 0; i < 3; i++) {
        downMap.advanceChunk();
        this.map = this.map.concat(downMap.map);
    }

    // Asignar los objetos de colisión al jugador
    this.p.mapObjects = this.map; // Asegúrate de que 'mapObjects' contiene todos los objetos del mapa

    // Configurar la detección de colisiones
    collsObjects.pla = this.p; // Enlazar el jugador con el sistema de colisiones
    collsObjects.map = this.map; // Enlazar los objetos del mapa con el sistema de colisiones

    const gameWorld = document.getElementById("game-world");


    // Función para actualizar la vista centrada en el jugador
    this.updateView = () => {
        let playerX = this.p.player.x;
        let playerY = this.p.player.y;
        let halfScreenWidth = window.innerWidth / 2;
        let halfScreenHeight = window.innerHeight / 2;

        let translateX = 0;
        let translateY = 0;

        // Solo mover la cámara cuando el jugador está más allá de la mitad de la pantalla
        if (playerX > halfScreenWidth) {
            translateX = -(playerX - halfScreenWidth);
        }

        if (playerY > halfScreenHeight && playerY < window.innerHeight) {
            translateY = -(playerY - halfScreenHeight);
        }

        // Aplica la transformación suavemente
        gameWorld.style.transition = "transform 0.1s ease";
        gameWorld.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    // Llamar a updateView continuamente para actualizar la vista
    const gameLoop = () => {
        this.p.refreshColl();              // Reinicia las colisiones del jugador
        collsObjects.checkCollision();    // Verifica colisiones y actualiza el jugador
        this.updateView();                // Actualiza la cámara
        requestAnimationFrame(gameLoop);  // Bucle del juego
    };
    gameLoop()
};
// function Game(player) {
//     let downMap = new Map();
//     this.p = player;

//     // Inicializar el primer chunk
//     downMap.initialize();
//     this.map = downMap.createAndDraw();

//     // Cargar más chunks si es necesario
//     for (let i = 0; i < 3; i++) {
//         downMap.advanceChunk();
//         this.map = this.map.concat(downMap.map);
//     }

//     // Asignar los objetos de colisión al jugador
//     this.p.mapObjects = this.map;

//     // Configurar la detección de colisiones
//     collsObjects.pla = this.p;
//     collsObjects.map = this.map;

//     // Actualizar el estado del jugador y el mapa después de las colisiones
//     this.p = collsObjects.pla;
//     this.map = collsObjects.map;

//     // Seleccionar el contenedor del mundo del juego
//     const gameWorld = document.getElementById("game-world");

//     // Función para actualizar la vista centrada en el jugador
//     this.updateView = () => {
//         let playerX = this.p.player.x;
//         let playerY = this.p.player.y;
//         let halfScreenWidth = window.innerWidth / 2;
//         let halfScreenHeight = window.innerHeight / 2;

//         let translateX = 0;
//         let translateY = 0;

//         // Solo mover la cámara cuando el jugador está más allá de la mitad de la pantalla
//         if (playerX > halfScreenWidth) {
//             translateX = -(playerX - halfScreenWidth);
//         }

//         if (playerY > halfScreenHeight && playerY < window.innerHeight) {
//             translateY = -(playerY - halfScreenHeight);
//         }

//         // Aplica la transformación suavemente
//         gameWorld.style.transition = "transform 0.1s ease";  
//         gameWorld.style.transform = `translate(${translateX}px, ${translateY}px)`;
//     };

//     // Llamar a updateView continuamente para actualizar la vista
//     const gameLoop = () => {
//         this.p.refreshColl()
//         collsObjects.checkCollision();
//         this.updateView();
//         requestAnimationFrame(gameLoop);
//     };

//     gameLoop();
// }

export { Game };