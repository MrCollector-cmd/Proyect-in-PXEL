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
import { Bow } from "./weapons/Bow.js";
import { UI } from "./Ui/layerOfUi.js";
import { Crossbow } from "./weapons/Crossbow.js";
import { inventory } from "./Ui/Inventory.js";
import { Item } from "./Item.js";
import { imagesController } from "../../configs/imagesController.js";
import { proyectilBehaivior } from "./weapons/projectileBehavior.js";
import { Sword } from "./weapons/Sword.js";
import { readSpawn } from "../read/readSpawning.js";
class Game {
    constructor() {
        // //////////////////////////////////////////////////////////////////////
        imagesController.clearImageCache().then(() => {
            console.log("Caché de imágenes eliminado correctamente.");
        }).catch(err => {
            console.error("Error al limpiar la caché de imágenes:", err);
        });
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.context = this.canvas.getContext('2d');
        // Lee el bioma
        contextThisGame.readBiome(1);
        filters.color = contextThisGame.filter;
        // bandera de creacion de enemeigos
        this.enemiesCreated = false;
        this.map = new Map(contextThisGame.sizeInchuncks); // Inicializamos el mapa
        contextThisGame.mapThisGame = this.map
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
        this.visibleEntitiesSecondLayer = []
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
    }

    //actualiza los enemigos
    updateEnemiesMove() {
        const visibleArea = this.camera.getVisibleArea();
        contextThisGame.enemies.forEach(enemy => {
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
        if(!contextThisGame.ini)return
        if (contextThisGame.mapThisGame.maxChunksCreated && !contextThisGame.next)return
        console.log('creando el mapa Nivel '+ contextThisGame.levelAct)
        /////////Crea la base del mapa
        if (contextThisGame.mapThisGame.map.index1 === null) {
            contextThisGame.mapThisGame.initialize();
        }

        if (contextThisGame.mapThisGame.currentChunkIndex < contextThisGame.mapThisGame.maxChunks - 2) {
            contextThisGame.mapThisGame.advanceChunk();            
        }else{
            contextThisGame.mapThisGame.maxChunksCreated = true;
            contextThisGame.mapThisGame.ending()
        }
        if(contextThisGame.mapThisGame.maxChunksCreated && !this.enemiesCreated){
            // //////// Crea los objetos grande Arboles... etc
            contextThisGame.mapThisGame.map.index2 = readPatrons.createEntitiesFromCenterPositions(contextThisGame.mapThisGame.map.index1, 10,"swamp",['Mushrooms'])
            // /////// Crea los objetos decorativos
            contextThisGame.mapThisGame.map.index2.push(
                ...readPatrons.createEntitiesFromRandomPositions(contextThisGame.mapThisGame.map.index1,null,"swamp",['Mushrooms',"MushroomLightBottom","MushroomLightTop",'glowUp1','glowUp2','glowUp3','glowUp4'])
            );
            // /////// Crea una segunda capa de decorativos
            contextThisGame.mapThisGame.map.index4 = readPatrons.createEntitiesFromRandomPositions(contextThisGame.mapThisGame.map.index1,null,"swamp",['Mushrooms',"MushroomLightBottom","MushroomLightTop",'glowUp1','glowUp2','glowUp3','glowUp4'])
            // /////// Crea los enemigos
            readSpawn.spawnEnemies(contextThisGame.nameBiome,13)
            // /////// crea los objetos luminosos
            contextThisGame.mapThisGame.map.index5=readPatrons.createIluminations(contextThisGame.mapThisGame.map.index1,'swamp')
            // /////// crea el agua
            contextThisGame.mapThisGame.map.index3 = readPatrons.findEntitiesWithIdFiveAndWidths(contextThisGame.mapThisGame.map.index1)
            readSpawn.spawnPlayer();
        }
    }
    nextMap() {
        if (contextThisGame.next === false) {
            return; // Si la bandera `next` es falsa, no hace nada.
        }
        // Limpiar el mapa
        for (let key in contextThisGame.mapThisGame.map) {
            if (contextThisGame.mapThisGame.map.hasOwnProperty(key)) {
                // Se vacían los objetos de cada capa del mapa
                contextThisGame.mapThisGame.map[key] = null;
            }
        }
        // Reiniciar el índice del chunk
        contextThisGame.mapThisGame.currentChunkIndex = 0;
        // Reiniciar el estado de los chunks
        contextThisGame.mapThisGame.maxChunksCreated = false;
        //area visible Reiniciadas
        this.visibleEntitiesFirstLayer = []
        this.visibleEntitiesSecondLayer = []
        // Inicializar enemigos Reiniciados
        contextThisGame.enemies = [];
        // Restablecer la bandera de siguiente mapa
        contextThisGame.updateContext()
    }

    //dibuja los enemigos
    drawEnemies(offsetX, offsetY) {
        const visibleArea = this.camera.getVisibleArea();
        
        contextThisGame.enemies.forEach(enemy => {
            //verifica si el enemigo esta en la pantalla
            if (enemy.x + enemy.width > visibleArea.left - 500&&
                enemy.x < visibleArea.right + 200  &&
                enemy.y + enemy.height > visibleArea.top &&
                enemy.y < visibleArea.bottom) {
                enemy.draw(this.context, offsetX, offsetY);
            }
        });
    }
    drawElementsBiome(offsetX,offsetY,layer){
        const visibleArea = this.camera.getVisibleArea();
        contextThisGame.elementsOfMap.forEach(elem=>{
            if(typeof elem[0] == "function" && elem[1] == 1){
                elem[0](offsetX,offsetY,visibleArea,this.visibleEntitiesFirstLayer,this.context)
            }else if(typeof elem[0] == "function" && layer == "layer1" && elem[2] == 2){
                this.visibleEntitiesFirstLayer = elem[0](elem[1],offsetX,offsetY,visibleArea,this.visibleEntitiesFirstLayer,this.context)
            }else if(typeof elem[0] == "function" && layer == "layer2" && elem[2] == 3){
                this.visibleEntitiesSecondLayer = elem[0](elem[1],offsetX,offsetY,visibleArea,this.visibleEntitiesSecondLayer,this.context)
            }if(typeof elem[0] == "function" && elem[1] == 4 && layer == 'enemies'){
                elem[0](offsetX,offsetY,visibleArea,this.context)
            }
        })
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        // Obtiene los offsets de la cámara
        const { offsetX, offsetY } = this.camera.getOffset();
        if(contextThisGame.next === false){
            
            //dibuja el fondo
            filters.drawBackground(this.context,'image',{image:contextThisGame.background,blur:1})

            // Crea partículas
            particles.animate(this.context, this.canvas, offsetX,offsetY); 

            // Dibujar el mapa y jugador
            this.drawElementsBiome(offsetX,offsetY,'layer1')

            this.drawElementsBiome(offsetX,offsetY,'enemies')

            // Dibujar una capa de filtro
            filters.createAndDrawFilter(this.context);

            //dibuja al jugador
            contextThisGame.player.draw(this.context, offsetX, offsetY);
            contextThisGame.player.drawSelectedItem(this.context, offsetX, offsetY);

            
            // dibuja una segunda capa
            this.drawElementsBiome(offsetX,offsetY,'layer2')
            
            // //dibuja el agua
            // this.drawWater(offsetX,offsetY)
            this.drawElementsBiome(offsetX,offsetY)

            // Crea partículas
            particles.animate(this.context, this.canvas, offsetX,offsetY); 

            // sombras de la pantalla
            filters.drawBackground(this.context,'shadowsX')
            // Dibujar proyectiles
            proyectilBehaivior.drawProjectiles(this.context,offsetX, offsetY,contextThisGame.player.stats.proyectils,this.camera);

            //Dibuja la UI
            UI.drawPorcent(this.context)
            UI.drawUi(this.context)
            UI.drawInventory(this.context);

            mouseControlls.refreshMouseStyle();
        }
    }

    refresh(regTemp) {
        //carga los chunks del mapa
        this.loadMap();
        if(!contextThisGame.next){
            this.clearCanvas();
            UI.toggleInventory(controlls);
        
            this.updateEnemiesMove()
            readSpawn.reespawnPayer()
            // comienzo de escucha de controles
            controlls.refresh();
    
            this.updateEnemiesMove()
            // Asegúrate de que las entidades visibles están listas
            if (!this.visibleEntitiesFirstLayer || this.visibleEntitiesFirstLayer.length === 0) {
                console.warn("Entidades visibles no están listas.");
                this.visibleEntitiesFirstLayer = []; // Reinicia lista como arreglo vacío
            }
            console.log(this.visibleEntitiesFirstLayer)
            contextThisGame.player.move(this.visibleEntitiesFirstLayer, this.context);
            contextThisGame.player.handleMouseClick(this.camera);
            // fin de escucha y reseteo de controles
            controlls.restart();
            
            // Actualizar proyectiles
            contextThisGame.enemies = proyectilBehaivior.updateProyectils(contextThisGame.player.stats.proyectils,this.visibleEntitiesFirstLayer, contextThisGame.enemies);
            
            // Actualiza la cámara para seguir al jugador
            this.updateCamera(mouseControlls.getPosMouse());
    
            UI.getData();
        }
        this.nextMap();

    }
}

export { Game };

