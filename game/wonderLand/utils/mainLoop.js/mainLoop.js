import { controlls } from "../game/controlls/controlls.js";
import { mouseControlls } from "../game/controlls/mouse.js";
import { stateMachine } from "../stateMachine/stateMachine.js";

let mainLoop = {
    idEjecute: null,
    lastFrameTime: 0, // Marca de tiempo del último frame
    apsTarget: 60, // Actualizaciones por segundo objetivo
    fpsTarget: 60, // Frames por segundo objetivo
    apsInterval: 1000 / 60, // Intervalo entre actualizaciones (ms)
    fpsInterval: 1000 / 60, // Intervalo entre frames (ms)
    lastAPS: 0, // Última actualización lógica
    lastFPS: 0, // Última actualización gráfica
    aps: 0, // Contador de actualizaciones por segundo
    fps: 0, // Contador de frames por segundo
    iterator: function (timestamp) {
        mainLoop.idEjecute = window.requestAnimationFrame(mainLoop.iterator);

        // Actualiza la lógica (APS) según el intervalo
        if (timestamp - mainLoop.lastAPS >= mainLoop.apsInterval) {
            mainLoop.refresh(timestamp);
            mainLoop.lastAPS = timestamp;
            mainLoop.aps++;
        }

        // Renderiza (FPS) según el intervalo
        if (timestamp - mainLoop.lastFPS >= mainLoop.fpsInterval) {
            mainLoop.draw(timestamp);
            mainLoop.lastFPS = timestamp;
            mainLoop.fps++;
        }

        // Resetea los contadores cada segundo
        if (timestamp - mainLoop.lastFrameTime >= 1000) {
            mainLoop.lastFrameTime = timestamp;
            mainLoop.aps = 0;
            mainLoop.fps = 0;
        }
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
    }
};

export { mainLoop };