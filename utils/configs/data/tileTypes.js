import { getRandomMobFromBiome } from './biomeMobs.js';

const TILE_TYPES = {
    0: {
        name: "Empty",
        solid: false,
        sprite: null
    },
    1: {
        name: "Grass",
        solid: true,
        sprite: "src/terrain/grass.png"
    },
    2: {
        name: "Stone",
        solid: true,
        sprite: "src/terrain/stone.png"
    },
    3: {
        name: "Forest_Tree",
        solid: true,
        sprite: "src/terrain/forest/tree.png"
    },
    4: {
        name: "Desert_Cactus",
        solid: true,
        sprite: "src/terrain/desert/cactus.png"
    },
    5: {
        name: "Swamp_Tree",
        solid: true,
        sprite: "src/terrain/swamp/dead_tree.png"
    },
    6: {
        name: "Water",
        solid: false,
        sprite: "src/terrain/water.png",
        effect: "slow"
    },
    7: {
        name: "Forest_Spawn",
        solid: false,
        sprite: null,
        getMob: () => getRandomMobFromBiome('forest')
    },
    8: {
        name: "Dungeon_Spawn",
        solid: false,
        sprite: null,
        getMob: () => getRandomMobFromBiome('dungeon')
    },
    9: {
        name: "Swamp_Spawn",
        solid: false,
        sprite: null,
        getMob: () => getRandomMobFromBiome('swamp')
    }
};

// Función para obtener todos los tipos de tiles de un bioma específico
function getBiomeTiles(biomeName) {
    const biomeTiles = {};
    for (const [key, value] of Object.entries(TILE_TYPES)) {
        if (value.name.toLowerCase().includes(biomeName.toLowerCase())) {
            biomeTiles[key] = value;
        }
    }
    return biomeTiles;
}

export { TILE_TYPES, getBiomeTiles }; 