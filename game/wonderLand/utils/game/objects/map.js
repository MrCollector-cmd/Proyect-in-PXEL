import { Entity } from "./rect.js";
import { size } from "../../configs/size.js";
import { platforms } from "../../configs/patrons/patronsPlatforms.js";
import { readPatrons } from "../read/readPatrons.js";
function Map(m) {
    readPatrons.patrons = platforms;
    this.height = size.getTilesHeight();
    this.chunkSize = 20;
    this.currentChunkIndex = 0;
    this.maxChunks = m;
    this.advanceChunkCreated = false;
    this.map = {
        index1: null,
        index2: null,
        index3:null,
    }; // Entidades actualmente en el mapa
    this.objectsInMap = []; // Inicialización de objectsInMap
    this.maxChunksCreated = false;
}

// Crea entidades basadas en los datos de posición y las devuelve
Map.prototype.createObjectsInMap = function(objects) {
    if (!Array.isArray(this.map[objects[1]])) {
        this.map[objects[1]] = [];
    }
    objects[0].map(obj => {
        const entity = new Entity(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            obj.texture, // Textura específica del objeto
            obj.type,
            obj.repeatTexture,
            obj.id
        );
        // Agregar la entidad al mapa
        this.map[objects[1]].push(entity);
    });
};
// Avanza al siguiente chunk
Map.prototype.advanceChunk = function() {
    // Verificamos si hemos llegado al límite de los chunks que se pueden generar
    if (this.currentChunkIndex >= this.maxChunks - 1) {
        this.maxChunksCreated = true;
        return []; // No generar más chunks si ya hemos alcanzado el máximo
    } else if (this.currentChunkIndex <= this.maxChunks - 1) {
        // Incrementar el índice del chunk actual
        this.currentChunkIndex++;

        // Generar el siguiente chunk usando los patrones
        readPatrons.locatePoints(this.currentChunkIndex, 'index1', false);
        const objects = readPatrons.dataMap;

        // Dibujar los objetos generados en el nuevo chunk
        this.createObjectsInMap(objects);

        // Agregar los nuevos objetos generados al mapa
        this.map.index1.push(objects);

        this.maxChunksCreated = false
    }
};

// Inicializa el primer chunk
Map.prototype.initialize = function() {
    if (this.map.length > 0) {
        return this.map.index1; // Si ya está inicializado, no generar más
    }
    // Generar el siguiente chunk usando los patrones
    readPatrons.locatePoints(this.currentChunkIndex, 'index1');
    const objects = readPatrons.dataMap;
     // Dibujar los objetos generados en el nuevo chunk
    this.createObjectsInMap(objects);

    this.maxChunksCreated = false
    return this.map; // Devuelve las entidades iniciales
};

export { Map };