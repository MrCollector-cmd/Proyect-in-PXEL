import { size } from "../../configs/size.js";
import { Entity } from "../objects/rect.js";
const readPatrons = {
    patrons: null,
    chunkSize: 20,
    dataMap: [],
    // Selecciona un patrón aleatorio
    getRandomPatron: function () {
        const keys = Object.keys(readPatrons.patrons);
        const randomIndex = Math.floor(Math.random() * keys.length);
        return readPatrons.patrons[keys[randomIndex]];
    },
    // Genera datos de posición para cada rectángulo
    locatePoints: function (chunkIndex, index) {
        const offsetX = chunkIndex * this.chunkSize * size.tils;
        const pattern = this.getRandomPatron();
        const objects = [];
        const processed = new Set();  // Usamos un Set para marcar las celdas procesadas
    
        for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[0].length; x++) {
                const cell = pattern[y][x];
                if (cell === 0 || processed.has(`${y},${x}`)) continue;
    
                // Expansión del bloque
                let blockHeight = 1;
                while (y + blockHeight < pattern.length && pattern[y + blockHeight][x] === cell) {
                    blockHeight++;
                }
    
                let blockWidth = 1;
                while (x + blockWidth < pattern[0].length) {
                    let canExpand = true;
                    for (let i = 0; i < blockHeight; i++) {
                        if (pattern[y + i][x + blockWidth] !== cell) {
                            canExpand = false;
                            break;
                        }
                    }
                    if (!canExpand) break;
                    blockWidth++;
                }
    
                // Marcamos las celdas procesadas
                for (let j = y; j < y + blockHeight; j++) {
                    for (let i = x; i < x + blockWidth; i++) {
                        processed.add(`${j},${i}`);
                    }
                }
    
                // Definición de objeto
                const rectX = x * size.tils + offsetX;
                const rectY = y * size.tils;
                const width = blockWidth * size.tils;
                const height = blockHeight * size.tils;
    
                let objectType = "solid";
                let texture = "src/terrain/terrainPlatform.png";
                let repeatTexture = true;
                let id = 1;
    
                if (cell === 3) {
                    objectType = "solid";
                    texture = "src/terrain/terrainPlatform.png";
                    repeatTexture = true;
                    id = 3;
                } else if (cell === 4) {
                    objectType = "solid";
                    texture = "src/terrain/terrain.png";
                    repeatTexture = true;
                    id = 4;
                }
    
                // Añadimos el objeto al array de objetos
                objects.push({
                    x: rectX,
                    y: rectY,
                    width,
                    height,
                    type: objectType,
                    texture,
                    repeatTexture,
                    id: id
                });
            }
        }
    
        readPatrons.dataMap = [objects, index];
    },
    getPositionsWithIdOne: function(map) {
        const positions = [];
    
        // Itera solo sobre las entidades con id 1
        for (let entity of map) {
            if (entity.id === 1) {
                const tiles = entity.width / size.tils; // Asume que width es múltiplo de size.tils
    
                // Generar las posiciones de X para cada tile, agregando directamente
                for (let i = 0; i < tiles; i++) {
                    positions.push({
                        x: entity.x + i * size.tils,  // Incrementa la posición X por cada tile
                        y: entity.y                    // Mantén la misma posición Y
                    });
                }
            }
        }
    
        return positions; // Devuelve las posiciones de todos los tiles
    },
    createEntitiesFromRandomPositions: function(map) {
        const positions = this.getPositionsWithIdOne(map); // Obtener las posiciones con ID 1
        const entityTypes = [
            { id: 10, height: 2 * size.tils / 2.5, width: 2 * size.tils / 2.5, img: "src/terrain/swamp/mushrooms.png", type: "notColl", repeatTexture: null },
            { id: 11, height: 2 * size.tils / 2.5, width: 2 * size.tils / 2.5, img: "src/terrain/swamp/gras1.png", type: "notColl", repeatTexture: null },
            { id: 12, height: 1 * size.tils / 2, width: 1 * size.tils / 2, img: "src/terrain/swamp/gras2.png", type: "notColl", repeatTexture: null },
            { id: 13, height: 1 * size.tils / 2, width: 1 * size.tils / 2, img: "src/terrain/swamp/gras3.png", type: "notColl", repeatTexture: null },
            { id: 14, height: 2 * size.tils / 2.5, width: 2 * size.tils / 2.5, img: "src/terrain/swamp/gras4.png", type: "notColl", repeatTexture: null },
        ];
    
        const entitys = []; // Array que almacena las entidades creadas
    
        // Iterar sobre las posiciones por bloques de 10
        for (let i = 0; i < positions.length; i += 10) {
            const block = positions.slice(i, i + 10); // Tomar un bloque de 10 posiciones (o menos)
    
            // Seleccionar hasta 3 posiciones aleatorias del bloque
            const randomPositions = [];
            while (randomPositions.length < 3 && block.length > 0) {
                const randomIndex = Math.floor(Math.random() * block.length);
                randomPositions.push(block[randomIndex]);
                block.splice(randomIndex, 1); // Eliminar la posición seleccionada
            }
    
            // Crear entidades usando las posiciones aleatorias seleccionadas
            for (let j = 0; j < 3; j++) {
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)]; // Elegir tipo de entidad aleatorio
                const pos = randomPositions[j];
    
                if (pos) {
                    // Crear la entidad con las propiedades del tipo
                    const entity = new Entity(
                        pos.x, 
                        pos.y - entityType.height, // Ajustar la posición Y
                        entityType.width, 
                        entityType.height, 
                        entityType.img, 
                        entityType.type, 
                        entityType.repeatTexture, 
                        entityType.id
                    );
    
                    entitys.push(entity); // Añadir la entidad al array de entidades
                }
            }
        }
    
        return entitys;
    }
}
export { readPatrons };