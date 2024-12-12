import { Criature } from "./rect.js";
import { size } from "../../configs/size.js";
import { mouseControlls } from "../controlls/mouse.js";
import { Map } from "./map.js";
import { Camera } from "./camera.js";
import { filters } from "../stetics/filters.js";
import { contextThisGame } from "./context.js";
import { readPatrons } from "../read/readPatrons.js";
import { particles } from "../stetics/particles.js";
import { controlls } from "../controlls/controlls.js";
class Game {
    constructor() {
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.context = this.canvas.getContext('2d');

        contextThisGame.readBiome(1);

        this.map = new Map(contextThisGame.sizeInchuncks); // Inicializamos el mapa
        this.widthMap = this.map.maxChunks * size.tils;
        // Cargar al jugador
        this.loadPlayer(20, size.tils * 10, size.tils, size.tils, "src/skins/skinD.png", "player", { heal: 10, damage: 10 });

        // Crear la cámara
        const cameraWidth = this.canvas.width - 100; // 100px más pequeña que el canvas
        const cameraHeight = this.canvas.height - 100; // Agrega margen extra a la altura
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);

        //area visible
        this.visibleEntities = []
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

    loadMap() {
        if (!contextThisGame.player) {
            console.error("No se ha cargado un jugador.");
            return;
        }

        if (this.map.map.index1 === null) {
            this.map.initialize();
            contextThisGame.player.mapObjects = this.map.map.index1;
        }

        if (!this.map.maxChunksCreated) {
            this.map.advanceChunk();
            contextThisGame.player.mapObjects = this.map.map.index1;
            this.map.map.index2 = readPatrons.createEntitiesFromRandomPositions(this.map.map.index1);
        }
    }

    drawMap(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();

        // Almacenar entidades visibles
        this.visibleEntities = [];

        for (const indexDraw in this.map.map) {
            if (this.map.map[indexDraw] !== null) {
                this.map.map[indexDraw].forEach(entity => {
                    if (
                        entity.x + entity.width > visibleArea.left &&
                        entity.x < visibleArea.right &&
                        entity.y + entity.height > visibleArea.top &&
                        entity.y < visibleArea.bottom
                    ) {
                        this.visibleEntities.push(entity); // Almacenamos las entidades visibles
                    }
                });
            }
        }

        this.visibleEntities.forEach(entity => {
            entity.draw(this.context, offsetX, offsetY);
        });
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        // Obtiene los offsets de la cámara
        const { offsetX, offsetY } = this.camera.getOffset();

        // Crea partículas
        particles.animate(this.context, this.canvas);

        // Dibujar el mapa y jugador
        this.drawMap(offsetX, offsetY);

        //dibuja al jugador
        contextThisGame.player.draw(this.context, offsetX, offsetY);

        //dibuja el mouse
        mouseControlls.refreshMouseStyle();

        // Dibujar una capa de filtro
        filters.color = contextThisGame.filter;
        filters.createAndDrawFilter(this.context);
    }

    refresh() {
        // Limpia el canvas
        this.clearCanvas();

        //carga los chunks del mapa
        if (!this.map.maxChunksCreated) {
            this.loadMap();
        }

        // comienzo de escucha de controles
        controlls.refresh();

        // Mueve al jugador
        contextThisGame.player.move(this.visibleEntities);
        
        // fin de escucha y reseteo de controles
        controlls.restart();

        // Actualiza la cámara para seguir al jugador
        const posMouse = mouseControlls.getPosMouse();
        this.updateCamera(posMouse);

        
    }
}

export { Game };

