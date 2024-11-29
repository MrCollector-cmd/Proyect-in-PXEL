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
    gameLoop();
}
collsObjects.checkCollision = function() {
    for (let i = 0; i < this.map.length; i++) {
        let obj = this.map[i];
        if (obj.type === 'solid') {
            // Aquí pasa el objeto 'Player' y no el rectángulo
            const isColliding = this.pla.player.checkCollision(obj);

            if (isColliding) {
                // Aquí se resuelve la colisión pasando el objeto 'Player'
                this.resolveCollision(this.pla, obj);  // Pasar 'this.pla' (el objeto Player)
            }
        }
    }
};

collsObjects.resolveCollision = function(player, obj) {
    // Comprobamos las colisiones usando el método checkCollision de Rect
    const collisions = player.player.checkCollision(obj); // Usamos checkCollision del jugador (Rect)

    if (collisions) {
        // Si hay una colisión, ajustamos la posición del jugador dependiendo de la dirección de la colisión
        collisions.forEach(collision => {
            switch (collision) {
                case 'left':
                    player.x = obj.x - player.width; // Ajustamos la posición para evitar el solapamiento
                    player.pCollLeft = true;
                    break;
                case 'right':
                    player.x = obj.x + obj.width; // Ajustamos la posición para evitar el solapamiento
                    player.pCollRight = true;
                    break;
                case 'top':
                    player.y = obj.y - player.height; // Ajustamos la posición para evitar el solapamiento
                    player.pCollTop = true;
                    break;
                case 'bottom':
                    player.y = obj.y + obj.height; // Ajustamos la posición para evitar el solapamiento
                    player.pCollButton = true;

                    break;
            }
        });
    }
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