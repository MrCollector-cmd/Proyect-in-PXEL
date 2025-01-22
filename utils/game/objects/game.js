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
import { Bow } from "./weapons/Bow.js";
import { UI } from "./Ui/layerOfUi.js";
import { BIOME_MOBS } from "../../configs/data/biomeMobs.js";
import { Crossbow } from "./weapons/Crossbow.js";
import { inventory } from "./Ui/Inventory.js";
import { Item } from "./Item.js";
import { projectils } from "./weapons/proyectils.js";
import { imagesController } from "../../configs/imagesController.js";
import { proyectilBehaivior } from "./weapons/projectileBehavior.js";
import { Sword } from "./weapons/Sword.js";
class Game {
    constructor() {
        // //////////////////////////////////////////////////////////////////////
        imagesController.clearImageCache().then(() => {
            console.log("Caché de imágenes eliminado correctamente.");
        }).catch(err => {
            console.error("Error al limpiar la caché de imágenes:", err);
        });
        this.spawn = {x:0,y:0}
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.context = this.canvas.getContext('2d');
        // Lee el bioma
        contextThisGame.readBiome(1);
        // bandera de creacion de enemeigos
        this.enemiesCreated = false;
        this.map = new Map(contextThisGame.sizeInchuncks); // Inicializamos el mapa
        // Cargar al jugador
        this.loadPlayer(0, 0, size.tils, size.tils, "src/skins/skinD.png", "player", { heal: 10, damage: 10, dash:5, maxHeal:10, maxStamina:5, maxXp:100, level:1, xp:0,proyectils:[]});
       
        UI.dataPlayer = contextThisGame.player
        UI.getData();
        // Crear la cámara
        const cameraWidth = this.canvas.width - 100; // 100px más pequeña que el canvas
        const cameraHeight = this.canvas.height - 100; // Agrega margen extra a la altura
        this.camera = new Camera(cameraWidth, cameraHeight, cameraWidth / 2, cameraHeight / 2);
        contextThisGame.camera = this.camera
        //area visible
        this.visibleEntitiesFirstLayer = []
        this.waterEntitis = []
        this.visibleEntitiesSecondLayer = []
        // Inicializar enemigos
        this.enemies = [];
    
        // ////////////////////////////////////////////////////////////////////////
        //crear el inventario
        this.inv = new inventory()
        UI.dataInventory = this.inv
        let item = new Item('weapon',"Bow",'distance', new Bow())
        let item2 = new Item('weapon',"Crossbow",'distance', new Crossbow())
        let item3 = new Item('weapon',"Katana",'sword', new Sword())
        this.bow = item.obj
        UI.dataInventory.addItem(item2)
        UI.dataInventory.addItem(item)
        UI.dataInventory.addItem(item3)
        // ////////////////////////////////////////////////////////////////////
        // Inicializar el arco
        this.projectiles = [];
    }

    createEnemies(positions, biome) {
        // Asegúrate de que el bioma exista en el objeto BIOME_MOBS
        if (!BIOME_MOBS[biome]) {
            console.error(`El bioma "${biome}" no existe.`);
            return;
        }
    
        // Obtener los enemigos disponibles en el bioma
        const availableEnemies = BIOME_MOBS[biome];
    
        positions.forEach(pos => {
            // Seleccionar un enemigo aleatorio del bioma
            const enemyId = Math.floor(Math.random() * Object.keys(availableEnemies).length) + 1;
            const enemyData = availableEnemies[enemyId];
    
            // Crear el enemigo con un objeto de estadísticas único
            const enemy = new BasicEnemy(
                pos.x, 
                pos.y - 1 * size.tils, 
                size.tils, 
                size.tils, 
                enemyData.sprite,  // Usar el sprite del enemigo
                "enemy", 
                { heal: enemyData.heal, damage: enemyData.damage, xp:enemyData.xp }  // Aquí creas un objeto nuevo con sus estadísticas
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
        if (this.map.map.index1 === null) {
            this.map.initialize();
            contextThisGame.player.mapObjects = this.map.map.index1;
        }

        if (this.map.currentChunkIndex < this.map.maxChunks - 2) {
            this.map.advanceChunk();
            contextThisGame.player.mapObjects = this.map.map.index1;
            
        }else{
            this.spawn = this.map.map.index1.find(item=>item.id === 8)
            contextThisGame.player.x = this.spawn.x
            contextThisGame.player.y = this.spawn.y - 60
            this.map.ending()
            this.map.maxChunksCreated = true;
        }
        if(this.map.maxChunksCreated && !this.enemiesCreated){
            this.map.map.index2 = readPatrons.createEntitiesFromCenterPositions(this.map.map.index1, 10,"swamp",['Mushrooms'])
            this.map.map.index2.push(
                ...readPatrons.createEntitiesFromRandomPositions(this.map.map.index1,null,"swamp",['Mushrooms',"MushroomLightBottom","MushroomLightTop",'glowUp1','glowUp2','glowUp3','glowUp4'])
            );
            this.map.map.index4 = readPatrons.createEntitiesFromRandomPositions(this.map.map.index1,null,"swamp",['Mushrooms',"MushroomLightBottom","MushroomLightTop",'glowUp1','glowUp2','glowUp3','glowUp4'])
            let res = readPatrons.getForwardRandomPositions(this.map.map.index1, 13)
            // Crear múltiples enemigos en diferentes posiciones
            this.createEnemies(res,'swamp');
            this.map.map.index5=readPatrons.createIluminations(this.map.map.index1,'swamp')
        }
    }
    nextMap() {
        if (contextThisGame.next === false) {
            return; // Si la bandera `next` es falsa, no hace nada.
        }
        // Limpiar el mapa
        for (let key in this.map.map) {
            if (this.map.map.hasOwnProperty(key)) {
                // Se vacían los objetos de cada capa del mapa
                this.map.map[key] = null;
            }
        }
        // Reiniciar el índice del chunk
        this.map.currentChunkIndex = 0;
        // Reiniciar el estado de los chunks
        this.map.maxChunksCreated = false;
        //area visible Reiniciadas
        this.visibleEntitiesFirstLayer = []
        this.waterEntitis = []
        this.visibleEntitiesSecondLayer = []
        // Inicializar enemigos Reiniciados
        this.enemies = [];
        // Restablecer la bandera de siguiente mapa
        contextThisGame.updateContext()
    }
    drawMapFirstLayer(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();

        // Almacenar entidades visibles
        this.visibleEntitiesFirstLayer = [];
        const invertedObj = ['index1','index2'].reverse();
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
        let index = ['index4', 'index5']
        index.forEach(i=>{
            if (this.map.map[i] !== null ) {
                this.map.map[i].forEach(entity => {
                    if (
                        entity.x + entity.width > visibleArea.left - 100&&
                        entity.x < visibleArea.right + 100 &&
                        entity.y + entity.height > visibleArea.top&&
                        entity.y < visibleArea.bottom
                    ) {
                        this.visibleEntitiesSecondLayer.push(entity); // Almacenamos las entidades visibles
                    }
                });
            }
        })

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
        filters.drawBackground(this.context,'image',{image:contextThisGame.background,blur:1})

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
        contextThisGame.player.drawSelectedItem(this.context, offsetX, offsetY);
        // this.drawSelectedItem(offsetX, offsetY);

        
        // dibuja una segunda capa
        this.drawMapSecondLayer(offsetX,offsetY)
        
        //dibuja el agua
        this.drawWater(offsetX,offsetY)

        // Crea partículas
        particles.animate(this.context, this.canvas, offsetX,offsetY); 

        // sombras de la pantalla
        filters.drawBackground(this.context,'shadowsX')
        // Dibujar proyectiles
        proyectilBehaivior.drawProjectiles(this.context,offsetX, offsetY,this.projectiles,this.camera);

        //Dibuja la UI
        UI.drawPorcent(this.context)
        UI.drawUi(this.context)
        if (contextThisGame.player.stats.heal <= 0 || 
            contextThisGame.player.x < 0 || 
            contextThisGame.player.x > contextThisGame.dimensions.width || 
            contextThisGame.player.y < 0 || 
            contextThisGame.player.y > contextThisGame.dimensions.height){

            contextThisGame.player.x = this.spawn.x 
            contextThisGame.player.y = this.spawn.y - 60
            contextThisGame.player.stats.heal = 10
            contextThisGame.player.movePlayer = false
        }
        // Dibujar el inventario si está abierto
        if (controlls.inventoryOpen) {
            UI.dataInventory.isOpen = true;
            UI.drawInventory(this.context);
        } else {
            UI.dataInventory.isOpen = false;
        }

        //dibuja el mouse
        mouseControlls.refreshMouseStyle();
    }

    refresh(regTemp) {
        const { offsetX, offsetY } = this.camera.getOffset();
        this.projectiles = contextThisGame.player.stats.proyectils
        // Limpia el canvas
        this.clearCanvas();
        //carga los chunks del mapa
        if (!this.map.maxChunksCreated && contextThisGame.next === false) {
            console.log(contextThisGame.levelAct)
            this.loadMap();
            let water = readPatrons.findEntitiesWithIdFiveAndWidths(this.map.map.index1)
            this.map.map.index3 = water
        }
        
        this.updateEnemies()
        
        // comienzo de escucha de controles
        controlls.refresh();

        this.updateEnemies()
        contextThisGame.player.move(this.visibleEntitiesFirstLayer, this.camera, this.enemies);
        contextThisGame.player.handleMouseClick(this.camera);
        // fin de escucha y reseteo de controles
        controlls.restart();
        
        // Actualizar proyectiles
        this.enemies = proyectilBehaivior.updateProyectils(this.projectiles,this.visibleEntitiesFirstLayer, this.enemies);
        
        // Actualiza la cámara para seguir al jugador
        this.updateCamera(mouseControlls.getPosMouse());

        UI.getData();

        this.nextMap();

        // Actualizar el frame del arco si está cargando
        if (this.bow.charging) {
            const chargeTime = Date.now() - this.bow.chargeStartTime;
            const chargeRatio = Math.min(chargeTime, this.bow.maxCharge) / this.bow.maxCharge;
            this.bow.updateFrame(chargeRatio);
        } else {
            this.bow.updateFrame(0);
        }
    }
}

export { Game };

