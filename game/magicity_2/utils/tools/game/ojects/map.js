import { platforms } from "../patrons/patronsPlatforms.js";
import { Rect } from "../../rect.js";
import { size } from "../../size.js";
function Map() {
    this.height = size.getTilesHeight();
    this.chunkSize = 10; // Tamaño de cada chunk en tiles
    this.currentChunkIndex = 0; // Índice del chunk actual
    this.patrons = platforms;
    this.objectsInMap = [];
    this.map = [];
}
// Método para obtener un patrón aleatorio de la lista de patrones
Map.prototype.getRandomPatron = function() {
    const keys = Object.keys(this.patrons); // Obtener las claves de los patrones
    const randomIndex = Math.floor(Math.random() * keys.length); // Seleccionar un índice aleatorio
    return this.patrons[keys[randomIndex]]; // Devolver el patrón aleatorio
};

Map.prototype.locatePoints = function(chunkIndex) {
    let obj = [];
    let offsetX = chunkIndex * this.chunkSize; // Desplazamiento en X para el chunk actual

    // Obtener un patrón aleatorio
    let randomPatron = this.getRandomPatron();

    for (let y = 0; y < this.height; y++) {
        // Obtener la fila de la matriz de patrones, con repetición si es necesario
        let posActY = randomPatron[y % this.chunkSize];

        for (let x = 0; x < this.chunkSize; x++) {
            if (posActY[x] === 1) {
                let rectStartX = x + offsetX; // Posición absoluta dentro del mapa
                let width = 1;

                // Contar cuántos 1s hay seguidos en la misma fila
                while (x + 1 < this.chunkSize && posActY[x + 1] === 1) {
                    width++;
                    x++;
                }

                obj.push([rectStartX, y, width]); // Guardar la posición y el ancho del objeto
            }
        }
    }

    this.objectsInMap = obj;
    return obj;
};

Map.prototype.createAndDraw = function() {
    this.map = []; // Limpiar el mapa anterior
    this.objectsInMap.forEach(ele => {
        let [startX, y, width] = ele;
        let temp = new Rect(
            startX * size.tils,
            y * size.tils,
            width * size.tils, // Usar el ancho calculado
            1 * size.tils,
            'solid'
        );
        this.map.push(temp);
    });
    return this.map;
};

// Método para avanzar al siguiente chunk y dibujar en el espacio siguiente
Map.prototype.advanceChunk = function() {
    this.currentChunkIndex++; // Avanzar al siguiente chunk
    this.locatePoints(this.currentChunkIndex); // Localizar puntos del nuevo chunk
    return this.createAndDraw(); // Crear y dibujar el nuevo chunk
};

// Inicializar el mapa y crear el primer chunk
Map.prototype.initialize = function() {
    this.locatePoints(this.currentChunkIndex);
    this.createAndDraw();
};

export { Map };