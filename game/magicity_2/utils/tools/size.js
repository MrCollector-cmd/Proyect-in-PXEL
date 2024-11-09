import { start } from "../../main.js"
let size = {
    width: window.innerWidth,
    height: window.innerHeight,
    tils:60,
    scale: 1,
    initSize:function(){
        window.addEventListener('resize',function(e){
            size.width= window.innerWidth
            size.height= window.innerHeight
        })
    },
    getTilesWitdth:function(){
        var tilsFin = size.scale * size.tils;
        return Math.ceil((size.width - tilsFin) / tilsFin);
    },
    getTilesHeight:function(){
        var tilsFin = size.scale * size.tils;
        return Math.ceil((size.height - tilsFin) / tilsFin);
    },
    getTotalTiles:function(){
        return size.getTilesHeight * size.getTilesWitdth;
    },
    getPxHeight:function(){
        return size.height
    }
}

export {size}