import { BIOMES } from "../../configs/data/biomeTypes.js"
let contextThisGame = {
    biome: null,
    sizeInchuncks: null,
    chunksLoaded: 5,
    player: null,
    filter: null,
    levelAct: null,
    levels: null,
    readBiome:function(biome) {
        if (biome === undefined) {
            console.error("No es posible leer el codigo del bioma")
            return;
        };
        contextThisGame.biome = biome;
        contextThisGame.sizeInchuncks = BIOMES[biome].mapsSize
        contextThisGame.levels = BIOMES[biome].levels
        contextThisGame.filter = BIOMES[biome].filter
        contextThisGame.levelAct = 1;
    }
}

export {contextThisGame}