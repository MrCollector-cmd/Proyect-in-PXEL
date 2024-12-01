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

                obj.push([rectStartX, y, width, 'solid']); // Guardar el objeto sólido
            }
            
            // Detectar secuencias de 2s y crear un rectángulo con tipo "notCollInBords"
            if (posActY[x] === 2) {
                let rectStartX = x + offsetX; // Posición absoluta dentro del mapa
                let width = 1;

                // Contar cuántos 2s consecutivos hay en la misma fila
                while (x + 1 < this.chunkSize && posActY[x + 1] === 2) {
                    width++;
                    x++;
                }

                obj.push([rectStartX, y, width, 'notCollInBords']); // Guardar el objeto con el tipo "notCollInBords"
            }
        }
    }

    this.objectsInMap = obj;
    return obj;
};

Map.prototype.createAndDraw = function() {
    this.map = []; // Limpiar el mapa anterior
    this.objectsInMap.forEach(ele => {
        let [startX, y, width, type] = ele;
        let temp = new Rect(
            startX * size.tils,
            y * size.tils,
            width * size.tils,
            1 * size.tils,  // Asegúrate de que la altura también está bien definida
            type
        );

        this.map.push(temp);
    });
    return this.map;
};
Map.prototype.removeChunk = function (playerX) {
    // Define un margen alrededor del jugador para mantener visibles ciertos chunks
    const margin = 5; // En tiles
    const visibleStart = Math.floor((playerX / size.tils) - margin);
    const visibleEnd = Math.floor((playerX / size.tils) + margin);

    // Filtra los chunks que están fuera del rango visible
    this.objectsInMap = this.objectsInMap.filter(obj => {
        const objEndX = obj[0] + obj[2]; // Posición final del rectángulo
        return objEndX >= visibleStart && obj[0] <= visibleEnd; // ¿Está en el rango visible?
    });

    // Actualiza el DOM: elimina solo los rectángulos que no están en objectsInMap
    const allRects = Array.from(document.querySelectorAll(".rect")); // Selecciona todos los rectángulos
    allRects.forEach(rect => {
        const rectX = parseInt(rect.style.left) / size.tils; // Calcula la posición X del rect
        const isVisible = this.objectsInMap.some(obj => rectX >= obj[0] && rectX < obj[0] + obj[2]);
        if (!isVisible) rect.remove(); // Elimina solo los rectángulos no visibles
    });
};

Map.prototype.advanceChunk = function () {
    this.currentChunkIndex++; // Incrementa el índice del chunk
    console.log("Avanzando al chunk:", this.currentChunkIndex);

    // Genera el nuevo chunk
    this.locatePoints(this.currentChunkIndex);

    // Crea y dibuja el nuevo chunk
    const newChunk = this.createAndDraw();

    // Verifica los objetos generados
    console.log("Nuevos objetos generados:", newChunk.length);

    return newChunk;
};
// Inicializar el mapa y crear el primer chunk
Map.prototype.initialize = function() {
    this.locatePoints(this.currentChunkIndex);
    this.createAndDraw();
};

export { Map };
