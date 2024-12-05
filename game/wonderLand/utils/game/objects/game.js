import { Criature } from "./rect.js";
import { size } from "../../configs/size.js";
import { mainLoop } from "../../mainLoop.js/mainLoop.js";
import { Map } from "./map.js";
import { Camera } from "./camera.js";

class Game {
    constructor() {
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.canvas.style.border = '1px solid black';
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');

        // Propiedades relacionadas con el mapa
        this.chunksAll = 5;
        this.map = new Map(this.chunksAll); // Inicializamos el mapa
        this.mapSets = {
            height: size.height,
            width: (size.tils * 10)*this.chunksAll// saca el tamanio de cada chunk y lo multiplica por la cantidad de chunks
        };

        // Cargar al jugador
        this.player = null;
        this.loadPlayer(20, 20, size.tils, size.tils, "src/skins/skinD.png", "player", { heal: 10, damage: 10 });

        // Crear la cámara
        const cameraWidth = this.canvas.width - 100; // 100px más pequeña que el canvas
        const cameraHeight = this.canvas.height - 100;
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);
    }
    updateCamera(posMouse) {
        this.camera.follow(this.player, posMouse, this.canvas); // Actualiza la posición de la cámara basándose en el jugador
    }
    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loadPlayer(x, y, width, height, imgPath, type, stats) {
        this.player = new Criature(x, y, width, height, imgPath, type, stats);
    }

    start() {
        if (!this.player) {
            console.error("No se ha cargado un jugador.");
            return;
        }

        if (this.map.map.length === 0) {
            const mapEntities = this.map.initialize();
            this.player.mapObjects = mapEntities;
        }
        for (let i = 0; i < 4; i++) {
            this.map.advanceChunk();
        }

        this.drawLoop();
    }

    drawMap() {
        const { offsetX, offsetY } = this.camera.getOffset();

        this.map.map.forEach(entity => {
            entity.draw(this.context, offsetX, offsetY);
        });
    }

    draw() {
        // Limpia el lienzo
        this.clearCanvas();
        // Obtiene la posicion del mouse
        let posMouse = mainLoop.posMouse;
        // Actualizar la cámara para que siga al jugador
        this.updateCamera(posMouse)
        // Dibujar mapa y jugador
        this.drawMap();
        const { offsetX, offsetY } = this.camera.getOffset();
        this.player.draw(this.context, offsetX, offsetY);

        // Mover al jugador
        this.player.move();


        // Dibujar una capa negra con opacidad
        this.context.globalAlpha = 0.3;  // Ajusta la opacidad (0.0 completamente transparente, 1.0 completamente opaco)
        this.context.fillStyle = 'black'; // Establecer el color de la capa (negro)
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); // Dibuja el rectángulo que cubre todo el canvas
        this.context.globalAlpha = 1.0;  // Restaurar la opacidad a su valor predeterminado (opcional)

        // Mostrar FPS y APS
        this.context.fillStyle = 'black';
        this.context.fillText(`FPS: ${mainLoop.fps}`, 10, 20);
        this.context.fillText(`APS: ${mainLoop.aps}`, 10, 40);
    }

    drawLoop() {
        this.clearCanvas();
        this.draw();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Game };

