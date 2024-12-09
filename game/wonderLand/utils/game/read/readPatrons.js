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
        const processed = Array(pattern.length)
            .fill(0)
            .map(() => Array(pattern[0].length).fill(false)); // Matriz para marcar celdas procesadas

        pattern.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (processed[y][x] || cell === 0) return; // Ignorar celdas procesadas o vacías

                // Expandir verticalmente
                let blockHeight = 1;
                for (let j = y + 1; j < pattern.length; j++) {
                    if (pattern[j][x] === cell) {
                        blockHeight++;
                    } else {
                        break;
                    }
                }

                // Expandir horizontalmente
                let blockWidth = 1;
                for (let i = x + 1; i < pattern[0].length; i++) {
                    const currentColumn = pattern.slice(y, y + blockHeight).map((row) => row[i]);
                    if (currentColumn.every((value) => value === cell)) {
                        blockWidth++;
                    } else {
                        break;
                    }
                }

                // Marcar celdas como procesadas
                for (let j = y; j < y + blockHeight; j++) {
                    for (let i = x; i < x + blockWidth; i++) {
                        processed[j][i] = true;
                    }
                }

                // Crear el objeto basado en el tipo de celda
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
                    id = 4;
                    texture = "src/terrain/terrain.png";
                }

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
            });
        });
        // Guardar datos generados
        readPatrons.dataMap = [objects, index];
    },
    getPositionsWithIdOne: function(map) {
        return map
            .filter(entity => entity.id === 1) // Filtra las entidades con id === 1
            .map(entity => {
                const tiles = Math.floor(entity.width / size.tils); // Divide el ancho entre el tamaño de un tile
    
                // Generar las posiciones de X para cada tile
                const positions = [];
                for (let i = 0; i < tiles; i++) {
                    // Calcula la posición X para cada tile
                    positions.push({
                        x: entity.x + i * size.tils,  // Incrementa la posición X por cada tile
                        y: entity.y                    // Mantén la misma posición Y
                    });
                }
    
                return positions;
            })
            .flat(); // Aplana el array para obtener una lista de posiciones X, Y
    },
    createEntitiesFromRandomPositions:function(map) {
        const positions = this.getPositionsWithIdOne(map);
        const entityTypes = [
            { id: 10,
                height: 2 * size.tils/2.5,
                width: 2 * size.tils/2.5,
                img: "src/terrain/swamp/mushrooms.png",
                type: "notColl",
                repeatTexture: null },
            { id: 11,
                height: 2 * size.tils/2.5,
                width: 2 * size.tils/2.5,
                img: "src/terrain/swamp/gras1.png",
                type: "notColl",
                repeatTexture: null },
            { id: 12,
                height: 1 * size.tils/2,
                width: 1 * size.tils/2,
                img: "src/terrain/swamp/gras2.png",
                type: "notColl",
                repeatTexture: null },
            { id: 13,
                height: 1 * size.tils/2,
                width: 1 * size.tils/2,
                img: "src/terrain/swamp/gras3.png",
                type: "notColl",
                repeatTexture: null },
            { id: 14,
                height: 2 * size.tils/2.5,
                width: 2 * size.tils/2.5,
                img: "src/terrain/swamp/gras4.png",
                type: "notColl",
                repeatTexture: null },
            // Agrega más tipos según sea necesario
        ];
        const selectedEntities = []; // Array para almacenar las posiciones seleccionadas
        const entitys = []// array que almacena los objetos entidad
        for (let i = 0; i < positions.length; i += 10) {
            // Tomar un bloque de 10 posiciones (o menos si no quedan 10)
            const block = positions.slice(i, i + 10);
    
            // Seleccionar hasta 3 posiciones aleatorias del bloque
            const randomPositions = [];
            while (randomPositions.length < 10 && block.length > 0) {
                const randomIndex = Math.floor(Math.random() * block.length);
                randomPositions.push(block[randomIndex]);
                block.splice(randomIndex, 1); // Elimina la posición elegida
            }

            // Paso 3: Crear nuevas entidades usando las posiciones seleccionadas
            const newEntities = [];
            entityTypes.forEach(entityType => {
            if (randomPositions.length > 0) {
                // Seleccionar una posición aleatoria para este tipo de entidad
                const randomIndex = Math.floor(Math.random() * randomPositions.length);
                const pos = randomPositions[randomIndex];

                // Crear la entidad con las propiedades del tipo
                newEntities.push({
                    id: entityType.id,
                    x: pos.x,
                    y: pos.y,
                    height: entityType.height,
                    width: entityType.width,
                    img: entityType.img,
                    type: entityType.type,
                    repeatTexture: null,
                });

        // Eliminar la posición seleccionada para evitar duplicados
        randomPositions.splice(randomIndex, 1);
        }
        });

selectedEntities.push(...newEntities);
        }
        
        selectedEntities.forEach(elem =>{
            let entity = new Entity(elem.x, elem.y - elem.height , elem.width, elem.height, elem.img, elem.type, elem.repeatTexture, elem.id)
            entitys.push(entity); 
        })
        
        return entitys;
    }

};
export { readPatrons };