import { toolsOfDrawing } from "../../game/stetics/drawingMap.js"
const BIOMES = {
    1:{
        name:"swamp",
        levels: 5,
        mapsSize:7,
        background:'src/terrain/background/Background1.png',
        filter:{
            r:4,
            g:48,
            b:15,
            opacity: 0.5
        },
        elements:[
            [toolsOfDrawing.drawWater,1]
            ,[toolsOfDrawing.drawInLayers,["index1",'index2'],2]
            ,[toolsOfDrawing.drawInLayers,["index4",'index5'],3]
            ,[toolsOfDrawing.drawEnemies,4]]
    }
}

export {BIOMES}