import { BIOMES } from "../../configs/data/biomeTypes.js"
import { imagesController } from "../../configs/imagesController.js";

let contextThisGame = {
    biome: null,
    sizeInchuncks: null,
    chunksLoaded: 5,
    player: null,
    filter: null,
    levelAct: null,
    levels: null,
    next:false,
    background:null,
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
        contextThisGame.background = imagesController.loadImage(BIOMES[biome].background)
    },
    updateContext:function() {
        if (contextThisGame.next == false) {
            return
        }
        if(this.levelAct < this.levels){
            contextThisGame.levelAct += 1;
            contextThisGame.next = false
        }
    }
}

export {contextThisGame}