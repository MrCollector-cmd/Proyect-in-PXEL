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
import { BasicEnemy } from "./enemies/BasicEnemy.js";
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
        const cameraHeight = this.canvas.height - 100; // Agrega margen extra a la altura
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);

        //area visible
        this.visibleEntities = []
        this.waterEntitis = []

        // Inicializar enemigos
        this.enemies = [];
        
        // Crear múltiples enemigos en diferentes posiciones
        this.createEnemies([
            { x: size.tils * 15, y: size.tils * 10 },
            { x: size.tils * 25, y: size.tils * 10 },
            { x: size.tils * 35, y: size.tils * 10 },
            { x: size.tils * 45, y: size.tils * 10 }
        ]);
    }

    createEnemies(positions) {
        positions.forEach(pos => {
            const enemy = new BasicEnemy(
                pos.x, 
                pos.y, 
                size.tils, 
                size.tils, 
                null, 
                "enemy", 
                { heal: 5, damage: 5 }
            );
            this.enemies.push(enemy);
        });
    }

    //actualiza los enemigos
    updateEnemies() {
        const visibleArea = this.camera.getVisibleArea();


        this.enemies.forEach(enemy => {
            //verifica si el enemigo esta en la pantalla
            if (enemy.x + enemy.width > visibleArea.left &&
                enemy.x < visibleArea.right &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom) {
                // Agregamos el enemigo a las entidades visibles
                this.visibleEntities.push(enemy);
                enemy.update(this.visibleEntities);
            }
        });
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
            if (this.map.map[indexDraw] !== null && indexDraw !== 'index3') {
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

    //dibuja los enemigos
    drawEnemies(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();
        
        this.enemies.forEach(enemy => {
            //verifica si el enemigo esta en la pantalla
            if (enemy.x + enemy.width > visibleArea.left &&
                enemy.x < visibleArea.right &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom) {
                enemy.draw(this.context, offsetX, offsetY);
            }
        });
    }

    drawWater(offsetX,offsetY){
        const visibleArea = this.camera.getVisibleArea();

        // Almacenar entidades visibles

        this.map.map.index3.forEach(entity => {
            if (
                entity.x + entity.width > visibleArea.left &&
                entity.x < visibleArea.right &&
                entity.y + entity.height > visibleArea.top &&
                entity.y < visibleArea.bottom
            ) {
                this.visibleEntities.push(entity); // Almacenamos las entidades visibles
            }
        });

        this.visibleEntities.forEach(entity => {
            if (entity.id === 6) {
                entity.draw(this.context, offsetX, offsetY);
            }
        });
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        // Obtiene los offsets de la cámara
        const { offsetX, offsetY } = this.camera.getOffset();

        // Dibujar el mapa y jugador
        this.drawMap(offsetX, offsetY);
        this.drawEnemies(offsetX, offsetY);

        // Crea partículas
        particles.animate(this.context, this.canvas); 

        // Dibujar una capa de filtro
        filters.color = contextThisGame.filter;
        filters.createAndDrawFilter(this.context);

        //dibuja al jugador
        contextThisGame.player.draw(this.context, offsetX, offsetY);

        //dibuja el agua
        this.drawWater(offsetX,offsetY)

        //dibuja el mouse
        mouseControlls.refreshMouseStyle();
    }

    refresh() {
        // Limpia el canvas
        this.clearCanvas();

        //carga los chunks del mapa
        if (!this.map.maxChunksCreated) {
            this.loadMap();
            let water = readPatrons.findEntitiesWithIdFiveAndWidths(this.map.map.index1)
            this.map.map.index3 = water
        }

        // comienzo de escucha de controles
        controlls.refresh();
        
        this.updateEnemies();
        contextThisGame.player.move(this.visibleEntities);
        
        // fin de escucha y reseteo de controles
        controlls.restart();

        // Actualiza la cámara para seguir al jugador
        this.updateCamera(mouseControlls.getPosMouse());
    }
}

export { Game };

