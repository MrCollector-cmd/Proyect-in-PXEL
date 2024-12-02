import { Entity } from "../../configs/rect.js";
import { size } from "../../configs/size.js";
import { platforms } from "../../configs/patrons/patronsPlatforms.js";

function Map() {
    this.height = size.getTilesHeight();
    this.chunkSize = 10; // Tamaño de cada chunk en tiles
    this.currentChunkIndex = 0;
    this.patrons = platforms; // Conjunto de patrones disponibles
    this.map = []; // Entidades actualmente en el mapa
}

// Selecciona un patrón aleatorio
Map.prototype.getRandomPatron = function () {
    const keys = Object.keys(this.patrons);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return this.patrons[keys[randomIndex]];
};

// Genera datos de posición para cada rectángulo
Map.prototype.locatePoints = function (chunkIndex) {
    const offsetX = chunkIndex * this.chunkSize * size.tils;
    const pattern = this.getRandomPatron();
    const objects = [];

    pattern.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                const rectX = x * size.tils + offsetX;
                const rectY = y * size.tils;
                const width = size.tils;
                const height = size.tils;
                objects.push({ x: rectX, y: rectY, width, height, type: "solid" });
            }
        });
    });

    return objects;
};

// Crea entidades basadas en los datos de posición y las devuelve
Map.prototype.createAndDraw = function (objects) {
    const entities = objects.map(obj => {
        const entity = new Entity(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            '../../../src/terrain/ParedTierra.png', // Imagen de ejemplo
            obj.type
        );
        this.map.push(entity); // Agrega la entidad al mapa
        return entity;
    });
    return entities; // Devuelve las nuevas entidades creadas
};

// Avanza al siguiente chunk
Map.prototype.advanceChunk = function () {
    if (this.currentChunkIndex >= this.maxChunks - 1) {
        console.log("Se ha alcanzado el límite máximo de chunks.");
        return []; // No generar más chunks
    }

    this.currentChunkIndex++;
    const objects = this.locatePoints(this.currentChunkIndex);
    const newEntities = this.createAndDraw(objects);

    return newEntities; // Devuelve las nuevas entidades creadas
};
// Inicializa el primer chunk
Map.prototype.initialize = function () {
    console.trace("initialize llamado");
    if (this.map.length > 0) {
        console.warn("El mapa ya ha sido inicializado.");
        return this.map; // Si ya está inicializado, no generar más
    }

    const objects = this.locatePoints(this.currentChunkIndex); // Generar datos de posición
    this.map = this.createAndDraw(objects); // Crear entidades y almacenarlas en el mapa
    return this.map; // Devuelve las entidades iniciales
};

export { Map };