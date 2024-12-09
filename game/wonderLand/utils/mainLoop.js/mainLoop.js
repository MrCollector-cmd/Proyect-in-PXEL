import { controlls } from "../game/controlls/controlls.js";
import { mouseControlls } from "../game/controlls/mouse.js";
import { stateMachine } from "../stateMachine/stateMachine.js";
let mainLoop = {
    idEjecute: null,
    targetFPS: 60,
    lastTime: 0,
    iterator: function (timestamp) {
        const interval = 1000 / mainLoop.targetFPS;

        if (timestamp - mainLoop.lastTime >= interval) {
            console.log()
            mainLoop.refresh(timestamp);
            mainLoop.draw(timestamp);
            mainLoop.lastTime = timestamp;
        }

        mainLoop.idEjecute = window.requestAnimationFrame(mainLoop.iterator);
    },
    adjustFPS: function (newFPS) {
        mainLoop.targetFPS = newFPS;
    },
    stop: function () {
        if (mainLoop.idEjecute) {
            window.cancelAnimationFrame(mainLoop.idEjecute);
            mainLoop.idEjecute = null;
        }
    },
    refresh: function (timestamp) {
        controlls.refresh();
        stateMachine.refresh(timestamp);
        controlls.restart();
    },
    draw: function (timestamp) {
        mouseControlls.refreshMouseStyle();
        mainLoop.posMouse = mouseControlls.getPosMouse();
        mainLoop.posMouse.mouseOut = mouseControlls.mouseOut;
        stateMachine.draw(timestamp);
    }
};

export { mainLoop };