import { Player } from "./tools/game/ojects/player.js";
import { keyboard } from "./tools/keyboard.js";
let mainLoop = {
    idEjecute: null,
    lastReg:0,
    aps:0,
    fps:0,
    iterator:function (regTemp) {
        mainLoop.idEjecute = window.requestAnimationFrame(mainLoop.iterator);

        mainLoop.refresh(regTemp);
        mainLoop.draw(regTemp)

        if (regTemp - mainLoop.lastReg > 999) {
            mainLoop.lastReg = regTemp;

            mainLoop.aps = 0;
            mainLoop.fps = 0;
        }
    },
    stop:function(){

    },
    refresh:function(regTemp){
        keyboard.restart();
        mainLoop.aps++;
    },
    draw:function(regTemp){
        mainLoop.fps++;
    }
};

export {mainLoop}