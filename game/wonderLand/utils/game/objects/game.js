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
import { Bow } from "./weapons/Bow.js";

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

        // Inicializar el arco
        this.bow = new Bow();

        // Añadir imágenes del arco
        this.bowImages = {
            frame1: new Image(),
            frame2: new Image(),
            frame3: new Image()
        };
        this.bowImages.frame1.src = 'src/weapons/BowFrame1.png';
        this.bowImages.frame2.src = 'src/weapons/BowFrame2.png';
        this.bowImages.frame3.src = 'src/weapons/BowFrame3.png';
        
        this.currentBowFrame = this.bowImages.frame1;

        // Modificar el evento mousedown
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0 && 
                this.inventory.selectedItem && 
                this.inventory.selectedItem.type === "test") {
                this.bow.startCharging();
            }
        });

        // Agregar evento mouseup
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0 && this.bow.charging) {
                const { offsetX, offsetY } = this.camera.getOffset();
                const playerCenterX = contextThisGame.player.x + contextThisGame.player.width / 2;
                const playerCenterY = contextThisGame.player.y + contextThisGame.player.height / 2;
                
                const mouseWorldX = e.clientX + offsetX;
                const mouseWorldY = e.clientY + offsetY;
                
                const projectile = this.bow.releaseCharge(
                    playerCenterX,
                    playerCenterY,
                    mouseWorldX,
                    mouseWorldY
                );
                
                if (projectile) {
                    this.projectiles.push(projectile);
                }
            }
        });

        this.projectiles = [];
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
            enemy.view = false;
            if (enemy.x + enemy.width > visibleArea.left - 100 &&
                enemy.x < visibleArea.right +100 &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom - 200) {
                this.visibleEntitiesFirstLayer.push(enemy);
                enemy.view = true;
                enemy.update(this.visibleEntitiesFirstLayer);
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

        if (this.map.map.index3) {
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
        }

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
        this.drawSelectedItem(offsetX, offsetY);

        
        // dibuja una segunda capa
        this.drawMapSecondLayer(offsetX,offsetY)

        // Dibujar una capa de filtro
        // filters.color;
        // filters.createAndDrawFilter(this.context);
        
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
        this.drawProjectiles(offsetX, offsetY);
        //dibuja el mouse
        mouseControlls.refreshMouseStyle();
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
        this.updateEnemies()
        // comienzo de escucha de controles
        controlls.refresh();
        this.updateEnemies()
        contextThisGame.player.move(this.visibleEntitiesFirstLayer, regTemp);
        
        // fin de escucha y reseteo de controles
        controlls.restart();
        
        // Actualizar proyectiles
        this.updateProjectiles();
        
        // Actualiza la cámara para seguir al jugador
        this.updateCamera(mouseControlls.getPosMouse());

        // Actualizar el frame del arco si está cargando
        if (this.bow.charging) {
            const chargeTime = Date.now() - this.bow.chargeStartTime;
            const chargeRatio = Math.min(chargeTime, this.bow.maxCharge) / this.bow.maxCharge;
            this.bow.updateFrame(chargeRatio);
        } else {
            this.bow.updateFrame(0);
        }
    }

    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(this.visibleEntitiesFirstLayer);
            
            // Verificar colisiones con enemigos
            for (let enemy of this.enemies) {
                if (projectile.checkEnemyCollision(enemy)) {
                    if (enemy.stats && enemy.stats.heal > 0) {
                        enemy.stats.heal -= 5;
                        if (enemy.stats.heal <= 0) {
                            this.enemies = this.enemies.filter(e => e !== enemy);
                        }
                    }
                    projectile.createExplosion();
                    return true;
                }
            }
            
            return projectile.active;
        });
    }

    drawProjectiles(offsetX, offsetY) {
        Projectile.drawProjectiles(this.projectiles, this.context, offsetX, offsetY, this.camera.getVisibleArea());
    }

    drawSelectedItem(offsetX, offsetY) {
        if (this.inventory.selectedItem && this.inventory.selectedItem.type === "test") {
            const player = contextThisGame.player;
            const playerCenterX = player.x + player.width/2;
            const playerCenterY = player.y + player.height/2;
            
            this.bow.drawInHand(
                this.context,
                playerCenterX,
                playerCenterY,
                offsetX,
                offsetY
            );
        }
    }
}

export { Game };

