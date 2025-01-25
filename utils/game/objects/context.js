import { BIOMES } from "../../configs/data/biomeTypes.js"
import { imagesController } from "../../configs/imagesController.js";
import { size } from "../../configs/size.js";
const contextThisGame = {
    spawn:{x:0,y:0},
    ini:false,
    enemies:[],
    camera:null,
    dimensions: {width:0,height:0},
    biome: null,
    nameBiome:null,
    sizeInchuncks: null,
    chunksLoaded: 5,
    player: null,
    filter: null,
    levelAct: null,
    levels: null,
    next:false,
    background:null,
    mapThisGame:null,
    elementsOfMap:null,
    readBiome:function(biome) {
        if (biome === undefined) {
            console.error("No es posible leer el codigo del bioma")
            return;
        };
        contextThisGame.biome = biome;
        contextThisGame.nameBiome = BIOMES[biome].name
        contextThisGame.sizeInchuncks = BIOMES[biome].mapsSize
        contextThisGame.levels = BIOMES[biome].levels
        contextThisGame.filter = BIOMES[biome].filter
        contextThisGame.elementsOfMap = BIOMES[biome].elements
        contextThisGame.levelAct = 1;
        contextThisGame.background = imagesController.loadImage(BIOMES[biome].background)
        contextThisGame.dimensions.width = size.tils * (contextThisGame.sizeInchuncks * 20)
        contextThisGame.dimensions.height = size.tils * 20;
        contextThisGame.ini = true
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