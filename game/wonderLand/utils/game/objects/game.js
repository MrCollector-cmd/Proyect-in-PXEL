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
import { Inventory } from "./Inventory.js";
import { Projectile } from "./Projectile.js";

class Game {
    constructor() {
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.context = this.canvas.getContext('2d');
        this.background =new Image()
        this.background.src = 'src/terrain/background/Background1.png'
        contextThisGame.readBiome(1);

        this.map = new Map(contextThisGame.sizeInchuncks); // Inicializamos el mapa

        // Cargar al jugador
        this.loadPlayer(3*size.tils, size.tils * 12, size.tils, size.tils, "src/skins/skinD.png", "player", { heal: 10, damage: 10, dash:5});

        // Crear la cámara
        const cameraWidth = this.canvas.width - 100; // 100px más pequeña que el canvas
        const cameraHeight = this.canvas.height - 100; // Agrega margen extra a la altura
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);

        //area visible
        this.visibleEntitiesFirstLayer = []
        this.waterEntitis = []
        this.visibleEntitiesSecondLayer = []
        // Inicializar enemigos
        this.enemies = [];
        
        // Crear múltiples enemigos en diferentes posiciones
        this.createEnemies([
            { x: size.tils * 15, y: size.tils * 10 },
            { x: size.tils * 25, y: size.tils * 10 },
            { x: size.tils * 35, y: size.tils * 10 },
            { x: size.tils * 45, y: size.tils * 10 }
        ]);

        this.inventory = new Inventory();

        this.projectiles = [];

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // 0 es clic izquierdo
                // Verificar si hay un item equipado y es el cubo azul
                if (this.inventory.selectedItem && this.inventory.selectedItem.type === "test") {
                    const { offsetX, offsetY } = this.camera.getOffset();
                    const playerCenterX = contextThisGame.player.x + contextThisGame.player.width / 2;
                    const playerCenterY = contextThisGame.player.y + contextThisGame.player.height / 2;
                    
                    // Calcular posición del mouse en el mundo
                    const mouseWorldX = e.clientX + offsetX;
                    const mouseWorldY = e.clientY + offsetY;
                    
                    // Crear nuevo proyectil
                    const projectile = new Projectile(
                        playerCenterX,
                        playerCenterY,
                        mouseWorldX,
                        mouseWorldY
                    );
                    this.projectiles.push(projectile);
                }
            }
        });
    }

    createEnemies(positions) {
        positions.forEach(pos => {
            const enemy = new BasicEnemy(
                pos.x, 
                pos.y, 
                size.tils, 
                size.tils, 
                'src/terrain/swamp/enemy/slime.png', 
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
            if (enemy.x + enemy.width > visibleArea.left - 100 &&
                enemy.x < visibleArea.right +100 &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom - 200) {
                // Agregamos el enemigo a las entidades visibles
                this.visibleEntitiesFirstLayer.push(enemy);
                enemy.view = true
                enemy.update(this.visibleEntitiesFirstLayer)
            }
            enemy.view = false
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
            this.map.map.index2 = readPatrons.createEntitiesFromCenterPositions(this.map.map.index1, 10)
            this.map.map.index2.push(
                ...readPatrons.createEntitiesFromRandomPositions(this.map.map.index1,null,"index1")
            );
            this.map.map.index4 = readPatrons.createEntitiesFromRandomPositions(this.map.map.index1)
        }
    }

    drawMapFirstLayer(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();

        // Almacenar entidades visibles
        this.visibleEntitiesFirstLayer = [];
        const invertedObj = Object.keys(this.map.map).reverse();
        for (const indexDraw of invertedObj) {
            if (this.map.map[indexDraw] !== null && indexDraw !== 'index3') {
                this.map.map[indexDraw].forEach(entity => {
                    if (
                        entity.x + entity.width > visibleArea.left - 500&&
                        entity.x < visibleArea.right + 500 &&
                        entity.y + entity.height > visibleArea.top &&
                        entity.y < visibleArea.bottom
                    ) {
                        this.visibleEntitiesFirstLayer.push(entity); // Almacenamos las entidades visibles
                    }
                });
            }
        }

        this.visibleEntitiesFirstLayer.forEach(entity => {
            entity.draw(this.context, offsetX, offsetY);
        });
    }
    drawMapSecondLayer(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();

        // Almacenar entidades visibles
        this.visibleEntitiesSecondLayer = [];

        if (this.map.map.index4 !== null ) {
            this.map.map.index4.forEach(entity => {
                if (
                    entity.x + entity.width > visibleArea.left - 100&&
                    entity.x < visibleArea.right + 100 &&
                    entity.y + entity.height > visibleArea.top &&
                    entity.y < visibleArea.bottom
                ) {
                    this.visibleEntitiesSecondLayer.push(entity); // Almacenamos las entidades visibles
                }
            });
        }

        this.visibleEntitiesSecondLayer.forEach(entity => {
            entity.draw(this.context, offsetX, offsetY);
        });
    }

    //dibuja los enemigos
    drawEnemies(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();
        
        this.enemies.forEach(enemy => {
            //verifica si el enemigo esta en la pantalla
            if (enemy.x + enemy.width > visibleArea.left - 500&&
                enemy.x < visibleArea.right + 200  &&
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
                entity.x + entity.width > visibleArea.left -200 &&
                entity.x < visibleArea.right +200 &&
                entity.y + entity.height > visibleArea.top &&
                entity.y < visibleArea.bottom
            ) {
                this.visibleEntitiesFirstLayer.push(entity); // Almacenamos las entidades visibles
            }
        });

        this.visibleEntitiesFirstLayer.forEach(entity => {
            if (entity.id === 6) {
                entity.draw(this.context, offsetX, offsetY);
            }
        });
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(timestamp) {
        // Obtiene los offsets de la cámara
        const { offsetX, offsetY } = this.camera.getOffset();

        //dibuja el fondo
        filters.drawBackground(this.context,'image',{image:this.background,blur:1})

        // Crea partículas
        particles.animate(this.context, this.canvas, offsetX,offsetY); 
        // Dibujar el mapa y jugador
        this.drawMapFirstLayer(offsetX, offsetY);
        this.drawEnemies(offsetX, offsetY);

        // Dibujar una capa de filtro
        filters.color = contextThisGame.filter;
        filters.createAndDrawFilter(this.context);

        //dibuja al jugador
        contextThisGame.player.draw(this.context, offsetX, offsetY);

        //dibuja el agua
        this.drawWater(offsetX,offsetY)
        console.log(this.visibleEntitiesFirstLayer, this.visibleEntitiesSecondLayer)
        // Crea partículas
        particles.animate(this.context, this.canvas, offsetX,offsetY); 

        // sombras de la pantalla
        filters.drawBackground(this.context,'shadowsX')

        // Dibujar el inventario si está abierto
        if (controlls.inventoryOpen) {
            this.inventory.isOpen = true;
            this.inventory.draw(this.context);
        } else {
            this.inventory.isOpen = false;
        }

        // Dibujar el mouse al final para que siempre esté encima
        mouseControlls.refreshMouseStyle();

        // Dibujar proyectiles
        this.projectiles.forEach(projectile => {
            projectile.draw(this.context, offsetX, offsetY);
        });
    }

    refresh(regTemp) {
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
        this.updateEnemies()
        contextThisGame.player.move(this.visibleEntities);
        
        // fin de escucha y reseteo de controles
        controlls.restart();

        // Actualiza la cámara para seguir al jugador
        this.updateCamera(mouseControlls.getPosMouse());
    }

    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            
            // Verificar colisiones con enemigos
            for (let enemy of this.enemies) {
                if (projectile.checkEnemyCollision(enemy)) {
                    // Si hay colisión, reducir la vida del enemigo
                    if (enemy.stats && enemy.stats.heal > 0) {
                        enemy.stats.heal -= 2;
                        if (enemy.stats.heal <= 0) {
                            // Eliminar el enemigo si su vida llega a 0
                            this.enemies = this.enemies.filter(e => e !== enemy);
                        }
                    }
                    return false; // Eliminar el proyectil
                }
            }
            
            return projectile.active;
        });
    }
}

export { Game };

