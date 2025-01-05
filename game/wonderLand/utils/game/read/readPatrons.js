import { size } from "../../configs/size.js";
import { Entity } from "../objects/rect.js";
import { platformsIni } from "../../configs/patrons/patronsPlatformsInit.js";
import { platformsEnd } from "../../configs/patrons/patronsPlatformsEnd.js";
const readPatrons = {
    patronsMid: null,
    patronsEnd: platformsEnd,
    patronStart:platformsIni,
    chunkSize: 20,
    dataMap: [],
    treePrime: true,
    // Selecciona un patrón aleatorio
    getRandomPatron: function (patrons) {
        const keys = Object.keys(patrons);
        const randomIndex = Math.floor(Math.random() * keys.length);
        return patrons[keys[randomIndex]];
    },
    // Genera datos de posición para cada rectángulo
    locatePoints: function (chunkIndex, index, patronsEndOrStart) {
        const offsetX = chunkIndex * readPatrons.chunkSize * size.tils;
    
        // Si se pasa patronName, buscamos el patrón correspondiente
        const pattern = patronsEndOrStart.patronStart
            ? readPatrons.getRandomPatron(readPatrons.patronStart)
            : patronsEndOrStart.patronEnd
            ? readPatrons.getRandomPatron(readPatrons.patronsEnd)
            : readPatrons.getRandomPatron(readPatrons.patronsMid);
                
        if (!pattern) {
            console.error(`Patrón no encontrado: ${patronsEndOrStart.patronStart}`);
            return; // Si no se encuentra el patrón, salimos de la función
        }
    
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
                let rectX = x * size.tils + offsetX;
                let rectY = y * size.tils;
                let width = blockWidth * size.tils;
                let height = blockHeight * size.tils;
                let notHeigt = false;
    
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
                } else if (cell === 5) {
                    objectType = "solid";
                    texture = "src/terrain/swamp/tarrain/waterBackground.png";
                    repeatTexture = true;
                    notHeigt = true;
                    id = 5;
                }
    
                if (!notHeigt) {
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
                } else {
                    rectY = rectY + 15;
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
        }
    
        readPatrons.dataMap = [objects, index];
    }
    ,/// posicion pres
    getPositionsWithIdOne: function(map) {
        const positions = [];
    
        // Itera solo sobre las entidades con id 1
        for (let entity of map) {
            if (entity.id === 1) {
                const tiles = entity.width / size.tils; // Asume que width es múltiplo de size.tils
    
                // Generar las posiciones de X para cada tile, omitiendo la primera y la última
                for (let i = 1; i < tiles - 1; i++) {  // Comienza en 1 y termina en tiles - 1
                    positions.push({
                        x: entity.x + i * size.tils,  // Incrementa la posición X por cada tile
                        y: entity.y                  // Mantén la misma posición Y
                    });
                }
            }
        }
    
        return positions; // Devuelve las posiciones de todos los tiles omitidos
    },
    getForwardRandomPositions: function (map, count = 5) {
        if (!map) return console.warn("No se ha pasado ningún mapa para la creación de enemigos");
    
        // Obtener todas las posiciones con id 1
        const positions = this.getPositionsWithIdOne(map);
        if (!positions.length) return console.warn("No hay posiciones válidas para seleccionar");
    
        const result = [];
        const usedPositions = new Set(); // Registro de posiciones ya usadas
        const minSeparation = 4 * size.tils; // Separación mínima entre posiciones
        let lastX = -Infinity; // Última posición X válida
    
        while (result.length < count) {
            // Filtrar posiciones válidas hacia adelante y no utilizadas
            const availablePositions = positions.filter(
                pos => pos.x > lastX + minSeparation && !usedPositions.has(pos)
            );
    
            // Si no hay posiciones válidas, reiniciar y buscar entre las no utilizadas
            if (!availablePositions.length) {
                lastX = -Infinity; // Reiniciar la posición
                continue; // Volver a filtrar con las posiciones restantes
            }
    
            // Seleccionar una posición aleatoria entre las disponibles
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const selectedPosition = availablePositions[randomIndex];
    
            // Guardar la posición seleccionada
            result.push(selectedPosition);
            usedPositions.add(selectedPosition); // Marcar la posición como utilizada
            lastX = selectedPosition.x; // Actualizar la última posición X
        }
    
        return result;
    }
    
    ,
    getCenterPositions: function (map, numPositions) {
        const positions = [];
    
        // Iterar sobre las entidades del mapa
        for (let entity of map) {
            if (entity.id === 1 && entity.width > 3 * size.tils) { // Filtrar solo las entidades con id 1 y width mayor a 180px (3 * size.tils)
                positions.push({
                    centerX: entity.x + entity.width / 2,  // Centro del width
                    centerY: entity.y + entity.height / 2  // Centro del height (dividido por 2 para centrado vertical)
                });
            }
        }
    
        // Determinar el número de posiciones a seleccionar
        // Si se pasa un valor de numPositions, usarlo, de lo contrario, seleccionar aleatoriamente entre 10 y el número total disponible
        const maxPositions = Math.min(30, positions.length); // Número máximo de posiciones a seleccionar, no más de 30
        const numToSelect = numPositions !== undefined ? numPositions : Math.max(10, Math.floor(Math.random() * maxPositions) + 1);
    
        // Si hay menos posiciones que las solicitadas, devolver todas las posiciones
        if (positions.length <= numToSelect) {
            return positions;
        }
    
        // Seleccionar posiciones aleatorias
        const randomPositions = [];
        const availableIndexes = Array.from({ length: positions.length }, (_, i) => i); // Índices disponibles
    
        // Elegir numToSelect índices aleatorios
        for (let i = 0; i < numToSelect; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndexes.length); // Obtener un índice aleatorio
            randomPositions.push(positions[availableIndexes[randomIndex]]); // Agregar la posición correspondiente
            availableIndexes.splice(randomIndex, 1); // Eliminar el índice seleccionado para evitar repeticiones
        }
    
        return randomPositions; // Devuelve las posiciones aleatorias seleccionadas
    },
    
    createEntitiesFromRandomPositions: function(map, quantity = null, imageIndex = null) {
        const basePath = imageIndex === 'index1' 
            ? "src/terrain/swamp/decor/new" 
            : "src/terrain/swamp/decor";
        
        const positions = readPatrons.getPositionsWithIdOne(map); // Obtener las posiciones con ID 1
        const entityTypes = [
            { id: 10, height: 2 * size.tils / 2.5, width: 2 * size.tils / 2.5, img: `${basePath}/mushrooms.png`, type: "notColl", repeatTexture: null },
            { id: 11, height: 4 * size.tils / 2.5, width: 4 * size.tils / 2.5, img: `${basePath}/bigGras1.png`, type: "notColl", repeatTexture: null },
            { id: 12, height: 2 * size.tils / 2.5, width: 2 * size.tils / 2.5, img: `${basePath}/littleGras1.png`, type: "notColl", repeatTexture: null },
            { id: 13, height: 2 * size.tils / 2.7, width: 2 * size.tils / 2.7, img: `${basePath}/littleGras2.png`, type: "notColl", repeatTexture: null },
            { id: 14, height: 1 * size.tils, width: 1 * size.tils, img: `${basePath}/littleGras3.png`, type: "notColl", repeatTexture: null, marginY: 1 * size.tils / 4 },
            { id: 15, height: 0.5 * size.tils, width: 1 * size.tils, img: `${basePath}/littleGras4.png`, type: "notColl", repeatTexture: null, marginY: 1 * size.tils / 5 }
        ];
    
        const entitys = []; // Array que almacena las entidades creadas
    
        // Si se proporciona `quantity`, generar entidades hasta alcanzarla
        if (quantity) {
            const shuffledPositions = [...positions].sort(() => Math.random() - 0.5); // Barajar las posiciones
            for (let i = 0; i < Math.min(quantity, shuffledPositions.length); i++) {
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const pos = shuffledPositions[i];
    
                if (pos && !entityType.marginY) {
                    const entity = new Entity(
                        pos.x,
                        pos.y - entityType.height,
                        entityType.width,
                        entityType.height,
                        entityType.img,
                        entityType.type,
                        entityType.repeatTexture,
                        entityType.id
                    );
                    entitys.push(entity);
                } else if (pos && entityType.marginY) {
                    const entity = new Entity(
                        pos.x,
                        pos.y - entityType.height + entityType.marginY,
                        entityType.width,
                        entityType.height,
                        entityType.img,
                        entityType.type,
                        entityType.repeatTexture,
                        entityType.id
                    );
                    entitys.push(entity);
                }
            }
            return entitys;
        }
    
        // Si no se proporciona `quantity`, ejecutar el comportamiento original
        for (let i = 0; i < positions.length; i += 10) {
            const block = positions.slice(i, i + 10); // Tomar un bloque de 10 posiciones (o menos)
    
            const randomPositions = [];
            while (randomPositions.length < 5 && block.length > 0) {
                const randomIndex = Math.floor(Math.random() * block.length);
                randomPositions.push(block[randomIndex]);
                
            }
    
            for (let j = 0; j < 5; j++) {
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const pos = randomPositions[j];
    
                if (pos && !entityType.marginY) {
                    const entity = new Entity(
                        pos.x,
                        pos.y - entityType.height,
                        entityType.width,
                        entityType.height,
                        entityType.img,
                        entityType.type,
                        entityType.repeatTexture,
                        entityType.id
                    );
                    entitys.push(entity);
                } else if (pos && entityType.marginY) {
                    const entity = new Entity(
                        pos.x,
                        pos.y - entityType.height + entityType.marginY,
                        entityType.width,
                        entityType.height,
                        entityType.img,
                        entityType.type,
                        entityType.repeatTexture,
                        entityType.id
                    );
                    entitys.push(entity);
                }
            }
        }
    
        return entitys;
    },
    // Busca entidades con ID 5 y calcula su agrupamiento y crea una nueva entidad
    findEntitiesWithIdFiveAndWidths: function (map) {
        const entitiesWithIdFive = map.filter(entity => entity.id === 5);

        // Agrupar las entidades cercanas por su posición X
        const groups = [];
        let currentGroup = [];
        let lastX = null;

        for (let entity of entitiesWithIdFive.sort((a, b) => a.x - b.x)) {
            if (lastX === null || Math.abs(entity.x - lastX) <= size.tils) {
                currentGroup.push(entity);
            } else {
                groups.push(currentGroup);
                currentGroup = [entity];
            }
            lastX = entity.x;
        }

        if (currentGroup.length > 0) groups.push(currentGroup);

        // Crear entidades nuevas basadas en los grupos
        return groups.map(group => {
            const totalWidth = group.reduce((sum, entity) => sum + entity.width, 0);
            const x = group[0].x;
            const y = group[0].y - 15; // Posición Y justo encima del grupo

            // Crear la nueva entidad
            return new Entity(x, y, totalWidth, 15, "src/terrain/swamp/water.png", "notCollOp", false, 6, 0.3);
        });
    },
    createEntitiesFromCenterPositions: function (map,numPositions) {
        const entities = [];
    
        // Obtener las posiciones centrales usando la función existente
        const centerPositions = readPatrons.getCenterPositions(map,numPositions);
    
        // Crear nuevas entidades a partir de las posiciones centrales
        centerPositions.forEach(pos => {
            const entity = new Entity(
                pos.centerX - 100,     // Posición X central
                pos.centerY - 230,     // Posición Y central
                200,              // Ancho de la entidad (ejemplo, puedes ajustarlo)
                200,              // Alto de la entidad (ejemplo, puedes ajustarlo)
                "src/terrain/swamp/decor/mushrooms.png",// 'src/obstacle/tree.png',   // Textura por defecto (ajústala si lo necesitas)
                'notColl',         // Tipo de entidad
                false,           // repeatTexture (por defecto)
                17    // ID aleatorio o puedes generar uno específico
            );
    
            // Agregar la entidad creada al array
            entities.push(entity);
        });
    
        return entities; // Devuelve el array con las nuevas entidades
    },
    createIluminations: function (map) {
        const entities = [];
    
        // Obtener posiciones de adelante usando la función getForwardRandomPositions
        const forwardPositions = this.getForwardRandomPositions(map);
    
        forwardPositions.forEach(pos => {
            // Crear la primera entidad en la posición obtenida
            const entity1 = new Entity(
                pos.x,  // Posición X central
                pos.y - 100,  // Posición Y central
                20,          // Ancho de la entidad
                100,          // Alto de la entidad
                "src/terrain/swamp/decor/ilumination/mushBottom.png", // Textura
                'notColl',    // Tipo de entidad
                false,        // repeatTexture
                18            // ID aleatorio o específico
            );
    
            // Crear la segunda entidad en la misma posición, pero ajustando la coordenada Y
            const entity2 = new Entity(
                pos.x - 13,  // Misma posición X
                pos.y - entity1.height - 35, // Posición Y ajustada hacia abajo
                40,          // Ancho de la entidad
                40,          // Alto de la entidad
                "src/terrain/swamp/decor/ilumination/mushTop.png", // Textura
                'solid',    // Tipo de entidad
                false,        // repeatTexture
                19,            // ID aleatorio o específico (diferente al de la primera)
                undefined,
                true ///brillo
            );
    
            // Agregar las dos entidades al array
            entities.push(entity1, entity2);
        });
    
        return entities; // Devuelve el array con las entidades creadas
    },
}
export { readPatrons };