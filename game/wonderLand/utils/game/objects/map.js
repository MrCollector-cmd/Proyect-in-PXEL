import { Entity } from "./rect.js";
import { size } from "../../configs/size.js";
import { platforms } from "../../configs/patrons/patronsPlatforms.js";

function Map(m) {
    this.height = size.getTilesHeight();
    this.chunkSize = 20; // Tamaño de cada chunk en tiles
    this.currentChunkIndex = 0;
    this.maxChunks = m
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
        let startX = null; // Marca el inicio de un bloque consecutivo para `1`
        let currentWidth = 0; // Acumula el ancho del bloque para `1`

        row.forEach((cell, x) => {
            if (cell === 1) {
                // Manejo de bloques `1`
                if (startX === null) {
                    startX = x; // Inicia un nuevo bloque
                    currentWidth = 1;
                } else {
                    currentWidth++; // Continúa el bloque actual
                }
            }if (cell === 2) {
                // Manejo de bloques `2` (altos)
                const rectX = x * size.tils + offsetX;
                const rectY = y * size.tils - size.tils * 3;
                const width = 3 * size.tils;
                const height = 4 * size.tils;

                objects.push({
                    x: rectX,
                    y: rectY,
                    width,
                    height,
                    type: "notColl",
                    texture: 'src/obstacle/tree.png',
                    repeatTexture: false
                });
            }if (cell === 4) {
                // Manejo de bloques `3` (largos y anchos)
                const rectX = x * size.tils + offsetX;
                const rectY = y * size.tils;

                // Calcular el tamaño del bloque (horizontal y vertical)
                let blockWidth = 1; // Ancho inicial
                let blockHeight = 1; // Alto inicial

                // Expandir horizontalmente
                for (let i = x + 1; i < row.length && pattern[y][i] === 3; i++) {
                    blockWidth++;
                }

                // Expandir verticalmente
                for (let j = y + 1; j < pattern.length; j++) {
                    const currentRow = pattern[j].slice(x, x + blockWidth);
                    if (currentRow.every(cell => cell === 3)) {
                        blockHeight++;
                    } else {
                        break;
                    }
                }


                // Marcar las celdas del bloque como procesadas
                for (let j = y; j < y + blockHeight; j++) {
                    for (let i = x; i < x + blockWidth; i++) {
                        if (pattern[j] && pattern[j][i] === 3) {
                            pattern[j][i] = 0; // Evitar procesarlo nuevamente
                        } else {
                        }
                    }
                }

                // Agregar el bloque completo
                objects.push({
                    x: rectX,
                    y: rectY,
                    width: blockWidth * size.tils,
                    height: blockHeight * size.tils,
                    type: "solid",
                    texture: 'src/terrain/terrain.png',
                    repeatTexture: true
                });
            } else if (startX !== null) {
                // Fin del bloque actual de `1`, agregarlo a objetos
                const rectX = startX * size.tils + offsetX;
                const rectY = y * size.tils;
                const width = currentWidth * size.tils;
                const height = size.tils;

                objects.push({
                    x: rectX,
                    y: rectY,
                    width,
                    height,
                    type: "solid",
                    texture: 'src/terrain/terrainPlatform.png',
                    repeatTexture: true
                });
                startX = null;
                currentWidth = 0;
            }
        });

        // Agregar el último bloque de la fila de `1`, si existe
        if (startX !== null) {
            const rectX = startX * size.tils + offsetX;
            const rectY = y * size.tils;
            const width = currentWidth * size.tils;
            const height = size.tils;

            objects.push({
                x: rectX,
                y: rectY,
                width,
                height,
                type: "solid",
                texture: 'src/terrain/terrainPlatform.png',
                repeatTexture: true
            });
        }
    });

    return objects;
};



// Crea entidades basadas en los datos de posición y las devuelve
Map.prototype.createAndDraw = function (objects) {
    const entities = objects.map(obj => {
        const entity = new Entity(
            obj.x ,
            obj.y,
            obj.width,
            obj.height,
            obj.texture, // Textura específica del objeto
            obj.type,
            obj.repeatTexture
        );

        // Agregar la entidad al mapa
        this.map.push(entity);
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
Map.prototype.updateMapBasedOnMouse = function (mouseWorldX, mouseWorldY) {
    const chunkWidth = this.chunkSize * size.tils; // Ancho de un chunk en píxeles
    const chunkHeight = this.height * size.tils;  // Altura de un chunk en píxeles

    // Calcula el índice del chunk donde está el mouse
    const chunkIndexX = Math.floor(mouseWorldX / chunkWidth);
    const chunkIndexY = Math.floor(mouseWorldY / chunkHeight);

    // Si el mouse está en un nuevo chunk, genera ese chunk
    if (chunkIndexX > this.currentChunkIndex && this.maxChunks) {
        this.currentChunkIndex = chunkIndexX; // Actualiza el índice actual
        const objects = this.locatePoints(this.currentChunkIndex); // Genera datos del chunk
        this.createAndDraw(objects); // Crea y dibuja el chunk
    }
};
// Inicializa el primer chunk
Map.prototype.initialize = function () {
    console.trace("initialize llamado");
    if (this.map.length > 0) {
        return this.map; // Si ya está inicializado, no generar más
    }

    const objects = this.locatePoints(this.currentChunkIndex); // Generar datos de posición
    this.map = this.createAndDraw(objects); // Crear entidades y almacenarlas en el mapa
    return this.map; // Devuelve las entidades iniciales
};

export { Map };