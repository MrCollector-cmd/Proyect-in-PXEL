import { collsObjects } from "./interacts/collsObjects.js";
import { Map } from "./ojects/map.js";
import { size } from "../size.js";
function Game(player) {
    let downMap = new Map();
    this.p = player;

    // Límite de chunks a mostrar
    this.maxChunks = 4;
    this.currentChunks = 0; // Contador de chunks generados

    // Inicializar el primer chunk
    downMap.initialize();
    this.map = downMap.createAndDraw();
    this.currentChunks++;

    // Cargar más chunks hasta alcanzar el límite
    for (let i = 1; i < this.maxChunks; i++) {
        downMap.advanceChunk();
        this.map = this.map.concat(downMap.map);
        this.currentChunks++;
    }

    // Asignar los objetos de colisión al jugador
    this.p.mapObjects = this.map;

    // Configurar la detección de colisiones
    collsObjects.pla = this.p; // Enlazar el jugador con el sistema de colisiones
    collsObjects.map = this.map; // Enlazar los objetos del mapa con el sistema de colisiones

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
        const gameWorld = document.getElementById("game-world");
        gameWorld.style.transition = "transform 0.1s ease";
        gameWorld.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    // Actualizar el estado del juego
    this.refreshState = () => {
        this.p.refreshColl(); // Reinicia las colisiones del jugador
        this.p.move()
        collsObjects.checkCollision(); // Verifica colisiones y actualiza el jugador

        // Verificar si es necesario avanzar el mapa
        if (this.currentChunks < this.maxChunks && this.p.player.x > downMap.chunkSize * (this.currentChunks - 1)) {
            downMap.advanceChunk();
            this.map = this.map.concat(downMap.map);
            this.p.mapObjects = this.map;
            collsObjects.map = this.map;
            this.currentChunks++;
        }

        this.updateView(); // Actualiza la cámara
    };

    this.drawGame = () => {
        // Aquí podemos agregar el código para dibujar cualquier cosa en el juego
    };
}


export { Game };