const BIOME_MOBS = {
    forest: {
        1: {
            name: "slime",
            health: 5,
            damage: 2,
            sprite: "src/terrain/swamp/enemy/slime.png"
        },
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
            name: "slime",
            heal: 5,
            damage: 2,
            xp:10,
            sprite: "src/terrain/swamp/enemy/slime.png",
        }
    }    
};


export { BIOME_MOBS }; 