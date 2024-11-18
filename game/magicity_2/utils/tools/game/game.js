
import { collsObjects } from "./interacts/collsObjects.js";
import { Map } from "./ojects/map.js";

function Game(player) {
    let downMap = new Map();
    this.p = player;

    // Inicializar el primer chunk
    downMap.initialize();
    this.map = downMap.createAndDraw();

    // Avanzar y agregar más chunks si es necesario
    downMap.advanceChunk(); // Dibujar el segundo chunk
    this.map = this.map.concat(downMap.map); // Agregar los nuevos rectángulos

    // Asignar los objetos de colisión al jugador
    this.p.mapObjects = this.map;

    // Aplicar la gravedad al jugador con el mapa
    this.p.gravity(this.map);

    // Configurar la detección de colisiones
    collsObjects.pla = this.p;
    collsObjects.map = this.map;
    collsObjects.checkCollision();

    // Actualizar el estado del jugador y el mapa después de las colisiones
    this.p = collsObjects.pla;
    this.map = collsObjects.map;
}

export { Game };