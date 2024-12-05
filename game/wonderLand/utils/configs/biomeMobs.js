const BIOME_MOBS = {
    forest: {
        1: {
            name: "slime",
            health: 100,
            damage: 15,
            sprite: "src/mobs/forest/slime.png"
        },
        2: {
            name: "Boar",
            health: 200,
            damage: 25,
            sprite: "src/mobs/forest/boar.png"
        },
        3: {
            name: "Bee",
            health: 50,
            damage: 5,
            sprite: "src/mobs/forest/bee.png"
        }
    },
    dungeon: {
        1: {
            name: "Skeleton",
            health: 50,
            damage: 30,
            sprite: "src/mobs/dungeon/skeleton.png"
        },
        2: {
            name: "Spider",
            health: 40,
            damage: 35,
            sprite: "src/mobs/dungeon/spider.png"
        },
        3: {
            name: "Bat",
            health: 150,
            damage: 15,
            sprite: "src/mobs/dungeon/bat.png"
        }
    },
    swamp: {
        1: {
            name: "Poisonous_Slime",
            health: 80,
            damage: 10,
            sprite: "src/mobs/swamp/poisonous_slime.png"
        },
        2: {
            name: "Troll",
            health: 250,
            damage: 30,
            sprite: "src/mobs/swamp/troll.png"
        },
        3: {
            name: "Poison_Frog",
            health: 40,
            damage: 40,
            sprite: "src/mobs/swamp/poison_frog.png"
        }
    }    
};

// Función para obtener un mob aleatorio de un bioma específico
function getRandomMobFromBiome(biomeName) {
    if (!BIOME_MOBS[biomeName]) { // Verificar si el bioma existe
        throw new Error(`Bioma '${biomeName}' no encontrado`);
    }
    const mobNumber = Math.floor(Math.random() * 3) + 1; // Generar un número aleatorio entre 1 y 3
    return BIOME_MOBS[biomeName][mobNumber]; // Retornar el mob correspondiente al número aleatorio
}

export { BIOME_MOBS, getRandomMobFromBiome }; 