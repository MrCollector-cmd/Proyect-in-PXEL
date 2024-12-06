import { Criature } from "./rect.js";
import { size } from "../../configs/size.js";
import { mainLoop } from "../../mainLoop.js/mainLoop.js";
import { Map } from "./map.js";
import { Camera } from "./camera.js";
import { filters } from "../stetics/filters.js";
import { contextThisGame } from "./context.js";
class Game {
    constructor() {
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.context = this.canvas.getContext('2d');

        contextThisGame.readBiome(1);

        this.map = new Map(contextThisGame.sizeInchuncks); // Inicializamos el mapa

        // Cargar al jugador
        this.loadPlayer(20, size.tils * 10, size.tils, size.tils, "src/skins/skinD.png", "player", { heal: 10, damage: 10 });

        // Crear la cámara
        const cameraWidth = this.canvas.width - 100; // 100px más pequeña que el canvas
        const cameraHeight = this.canvas.height - 100;
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);
    }
    updateCamera(posMouse) {
        this.camera.follow(contextThisGame.player, posMouse); // Actualiza la posición de la cámara basándose en el jugador
    }
    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loadPlayer(x, y, width, height, imgPath, type, stats) {
        contextThisGame.player = new Criature(x, y, width, height, imgPath, type, stats);
    }

    start() {
        if (!contextThisGame.player) {
            console.error("No se ha cargado un jugador.");
            return;
        }
        if (this.map.map.length === 0) {
            const mapEntities = this.map.initialize();
            contextThisGame.player.mapObjects = mapEntities;
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
        // Dibujar mapa y jugador
        this.drawMap();

        // Dibujar una capa de filtro
        filters.color = contextThisGame.filter
        filters.createAndDrawFilter(this.context);

        const { offsetX, offsetY } = this.camera.getOffset();
        contextThisGame.player.draw(this.context, offsetX, offsetY);

        // Mover al jugador
        contextThisGame.player.move();

        // Actualizar la cámara para que siga al jugador
        this.updateCamera(posMouse)
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

