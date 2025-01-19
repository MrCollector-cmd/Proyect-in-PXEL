import { size } from "../../configs/size.js";
import { Entity } from "../objects/rect.js";
import { platformsIni } from "../../configs/patrons/patronsPlatformsInit.js";
import { platformsEnd } from "../../configs/patrons/patronsPlatformsEnd.js";
import { TILE_TYPES } from "../../configs/data/tileTypes.js";
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
                else if (cell === 6) {
                    objectType = "notColl";
                    repeatTexture = false;
                    texture = null
                    notHeigt = true;
                    id = 6;
                }else if (cell === 8) {
                    objectType = "notColl";
                    repeatTexture = false;
                    texture = null
                    notHeigt = true;
                    id = 8;
                } else if (cell === 9) {
                    objectType = "solid";
                    texture = "src/terrain/terrain.png";
                    repeatTexture = true;
                    id = 9;
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
    getPositionsWithIdOne: function (map, ignore = false) {
    const positions = [];
    let ignoredFirst = false; // Flag para indicar si se ha ignorado la primera entidad

    // Itera sobre las entidades del mapa
    for (let entity of map) {
        if (entity.id === 1 || entity.id === 3) {
            const tiles = entity.width / size.tils; // Asume que width es múltiplo de size.tils

            // Si ignore es true, saltar la primera entidad con id === 1
            if (ignore && !ignoredFirst) {
                ignoredFirst = true; // Marca que la primera entidad ha sido ignorada
                continue; // Salta la iteración de la primera entidad
            }

            // Generar las posiciones de X para cada tile, omitiendo la primera y la última
            for (let i = 1; i < tiles - 1; i++) { // Comienza en 1 y termina en tiles - 1
                positions.push({
                    x: entity.x + i * size.tils,  // Incrementa la posición X por cada tile
                    y: entity.y                  // Mantén la misma posición Y
                });
            }
        }
    }

    return positions; // Devuelve las posiciones de todos los tiles omitidos
    },
    getPositionsWithOneInAir: function (map, context) {
    const positions = [];
    const minSeparation = 4 * size.tils; // Separación mínima de 8 tiles

    for (let entity of map) {
        // Ignorar entidades con id === 4
        if (entity.id === 4) {
            continue;
        }

        // Verificar si hay algún objeto en el mapa que esté directamente debajo de la entidad actual
        const isInAir = !map.some(otherEntity =>
            otherEntity !== entity && // Asegurar que no se compare con sí mismo
            otherEntity.x < entity.x + entity.width && // Solapamiento en el eje X
            otherEntity.x + otherEntity.width > entity.x && // Solapamiento en el eje X
            otherEntity.y === entity.y + size.tils // Exactamente debajo en el eje Y
        );

        if (isInAir) {
            // Si no tiene soporte, agregar al resultado
            const tiles = entity.width / size.tils; // Cantidad de tiles en la entidad

            // Generar las posiciones de X para cada tile, omitiendo la primera y la última
            for (let i = 1; i < tiles - 1; i++) { // Comienza en 1 y termina en tiles - 1
                const newPos = {
                    x: entity.x + i * size.tils,  // Incrementa la posición X por cada tile
                    y: entity.y                  // Mantén la misma posición Y
                };

                // Verificar que la nueva posición esté a una distancia mínima de 8 tiles de las posiciones existentes
                const isFarEnough = positions.every(pos => {
                    const distance = Math.abs(newPos.x - pos.x);
                    return distance >= minSeparation;
                });

                if (isFarEnough) {
                    positions.push(newPos);
                }
            }
        }
    }

    return positions; // Devuelve las posiciones en el aire con la separación mínima
    },
    getForwardRandomPositions: function (map, count = 5) {
    if (!map) return console.warn("No se ha pasado ningún mapa para la creación de enemigos")
    // Obtener todas las posiciones con id 1
    const positions = this.getPositionsWithIdOne(map, true);
    if (!positions.length) return console.warn("No hay posiciones válidas para seleccionar")
    const result = [];
    const usedPositions = new Set(); // Registro de posiciones ya usadas
    const minSeparation = 5 * size.tils; // Separación mínima entre posiciones
    const startingPositionIndex = 7; // Empezar después de las primeras 7 posiciones
    const availablePositions = positions.slice(startingPositionIndex); // Cortar las primeras 7 posiciones

    let lastX = availablePositions[0].x - minSeparation; // Inicializar para garantizar que la primera posición está alejada

    // Función para determinar si la distancia entre las posiciones es de 4 bloques con un 40% de probabilidad
    const shouldBeAtFourBlocks = () => Math.random() < 0.15; // 40% de probabilidad

    for (let i = 0; i < count; i++) {
        let selectedPosition = null;
        
        if (i === 0) {
            // Para el primer enemigo, seleccionar una posición aleatoria de las disponibles
            selectedPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        } else {
            // Para los siguientes enemigos, debemos tener en cuenta la separación
            let validPositions = availablePositions.filter(pos => !usedPositions.has(pos));

            if (shouldBeAtFourBlocks()) {
                // Si la probabilidad es 40%, el enemigo debe estar a 4 bloques de distancia
                validPositions = validPositions.filter(pos => Math.abs(pos.x - lastX) === minSeparation);
            } else {
                // Si no, podemos permitir cualquier posición válida
                validPositions = validPositions.filter(pos => Math.abs(pos.x - lastX) > minSeparation);
            }

            if (validPositions.length > 0) {
                // Seleccionamos aleatoriamente entre las posiciones válidas
                selectedPosition = validPositions[Math.floor(Math.random() * validPositions.length)];
            } else {
                // Si no hay posiciones válidas, reiniciar el proceso
                console.warn("No hay suficientes posiciones válidas, reiniciando...");
                i = -1;  // Reiniciar el ciclo
                usedPositions.clear();  // Limpiar las posiciones utilizadas
                continue;
            }
        }

        result.push(selectedPosition);
        usedPositions.add(selectedPosition); // Marcar la posición como utilizada
        lastX = selectedPosition.x; // Actualizar la última posición X
    }

    return result;
    },
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

    createEntitiesFromRandomPositions: function(map, quantity = null, typeBiome = null, exclude = []) {
        const positions = readPatrons.getPositionsWithIdOne(map); // Obtener las posiciones con ID 1
        if (typeBiome === null) {
            return;
        }
        const biome = TILE_TYPES[typeBiome]; // Acceder a las entidades del bioma Swamp
    
        const entitys = []; // Array que almacena las entidades creadas
    
        // Si se proporciona `quantity`, generar entidades hasta alcanzarla
        if (quantity) {
            const shuffledPositions = [...positions].sort(() => Math.random() - 0.5); // Barajar las posiciones
            for (let i = 0; i < Math.min(quantity, shuffledPositions.length); i++) {
                const entityNames = Object.keys(biome); // Obtener las claves de las entidades definidas
                const entityName = entityNames[Math.floor(Math.random() * entityNames.length)];
                const entityType = biome[entityName]; // Seleccionar un tipo de entidad aleatorio
    
                // Comprobar si el nombre de la entidad está en el array exclude
                if (exclude.includes(entityName)) {
                    continue; // Si está en exclude, omitir esta entidad
                }
    
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
                const entityNames = Object.keys(biome); // Obtener las claves de las entidades definidas
                const entityName = entityNames[Math.floor(Math.random() * entityNames.length)];
                const entityType = biome[entityName]; // Seleccionar un tipo de entidad aleatorio
    
                // Comprobar si el nombre de la entidad está en el array exclude
                if (exclude.includes(entityName)) {
                    continue; // Si está en exclude, omitir esta entidad
                }
    
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
    createEntitiesFromCenterPositions: function (map, numPositions, typeBiome = null, include = []) {
        const entities = [];
        if (typeBiome == null) {
            return;
        }
    
        // Obtener las posiciones centrales usando la función existente
        const centerPositions = readPatrons.getCenterPositions(map, numPositions);
        
        // Acceder a las entidades del bioma
        const biome = TILE_TYPES[typeBiome];
    
        // Asegurarnos de que `include` es un array (si no lo es, lo convertimos a uno vacío)
        if (!Array.isArray(include)) {
            include = [];
        }
    
        if (include.length > 0) {
            // Si se proporciona el argumento `include`, se agregan las entidades específicas
            const entityNames = Object.keys(biome);
    
            // Filtrar las entidades que están en el array `include` y existen en el bioma
            include.forEach(entityName => {
                if (entityNames.includes(entityName)) {
                    const entityType = biome[entityName];
    
                    centerPositions.forEach(pos => {
                        const entity = new Entity(
                            pos.centerX - 100, // Posición X central ajustada
                            pos.centerY - 230, // Posición Y central ajustada
                            entityType.width,  // Ancho de la entidad
                            entityType.height, // Alto de la entidad
                            entityType.img,    // Textura de la entidad
                            entityType.type,   // Tipo de entidad
                            entityType.repeatTexture, // Propiedad repeatTexture
                            entityType.id      // ID de la entidad
                        );
    
                        // Agregar la entidad creada al array
                        entities.push(entity);
                    });
                } else {
                    console.warn(`La entidad "${entityName}" no está definida en el bioma "${typeBiome}".`);
                }
            });
        }
    
        return entities; // Devuelve el array con las nuevas entidades
    },
createIluminations: function (map, biomeType = null) {
        const entities = [];
        if (biomeType == null) {
            return;
        }
    
        // Obtener posiciones de adelante usando la función getForwardRandomPositions
        const forwardPositions = this.getForwardRandomPositions(map);
        // Obtener posiciones de los bloques en el aire
        const airPositions = this.getPositionsWithOneInAir(map);
    
        // Iterar sobre las posiciones para crear las entidades principales
        forwardPositions.forEach(pos => {
            const biomeEntities = TILE_TYPES[biomeType];
            const glowEntities = Object.keys(biomeEntities).filter(type => biomeEntities[type].glowLeage);
    
            const sortedEntities = glowEntities.sort((a, b) => biomeEntities[a].glowLeage - biomeEntities[b].glowLeage);
    
            let yOffset = 0;
            let xOffset = 0;
    
            sortedEntities.forEach((type, index) => {
                const tile = biomeEntities[type];
    
                if (tile) {
                    if (tile.glowLeage === 1) {
                        yOffset = 0;
                        xOffset = 0;
                    } else if (tile.glowLeage === 2) {
                        const bottomEntity = biomeEntities[sortedEntities[0]];
                        yOffset += bottomEntity.height - 10;
                        xOffset = -14;
                    }
    
                    const entity = new Entity(
                        pos.x + xOffset,
                        pos.y - tile.height - yOffset,
                        tile.width,
                        tile.height,
                        tile.img,
                        tile.type,
                        tile.repeatTexture,
                        tile.id,
                        tile.marginY,
                        tile.glow || false
                    );
    
                    entities.push(entity);
                }
            });
        });
    
        // Agregar entidades con glowUp debajo de un subconjunto de airPositions
        if (airPositions.length > 0) {
            const biomeEntities = TILE_TYPES[biomeType];
            const glowUpEntities = Object.keys(biomeEntities).filter(type => biomeEntities[type].glowUp);
    
            // Elegir un subconjunto aleatorio de airPositions
            const randomPositions = airPositions.filter(() => Math.random() < 0.50); // % de probabilidades de seleccionar cada posición
    
            randomPositions.forEach(pos => {
                // Seleccionar un tipo aleatorio de las entidades con glowUp
                const randomType = glowUpEntities[Math.floor(Math.random() * glowUpEntities.length)];
                const tile = biomeEntities[randomType];
    
                if (tile) {
                    // Crear la entidad debajo de la posición en el aire
                    const entity = new Entity(
                        pos.x,
                        pos.y + tile.height + 10, // Posición Y debajo de la posición en el aire
                        tile.width,
                        tile.height,
                        tile.img,
                        tile.type,
                        tile.repeatTexture,
                        tile.id,
                        tile.marginY,
                        tile.glowUp || false
                    );
    
                    entities.push(entity);
                }
            });
        }
    
        return entities; // Devuelve el array con las entidades creadas
    }
    
    
    
    
}
export { readPatrons };