import { Rect,Being,Entity } from "../../configs/rect.js";
import { size } from "../../configs/size.js";
import { mainLoop } from "../../mainLoop.js/mainLoop.js";
import { move } from "../controlls/move/movePlayer.js";
import { Map } from "./map.js";
class Game {
    constructor() {
        // Crear el canvas
        this.canvas = document.getElementById('gameWorld');

        // Ajustar el tamaño inicial del canvas según el objeto size
        this.updateCanvasSize();

        this.canvas.style.border = '1px solid black';
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d'); // Contexto del canvas
        let img = new Image();
        img.src = '../../src/skins/Character1_1.png';
        this.player = null; // Almacena el personaje principal
        this.map = new Map();
        this.maxChunks = 1; // Limitar la cantidad de chunks
        this.loadPlayer(20, 20, 50, 50,img.src,'player',{heal:10,damage:10})
        // Escuchar cambios en el tamaño de la ventana para ajustar el canvas
    }
    // Actualizar las dimensiones del canvas según size
    updateCanvasSize() {
        this.canvas.width = size.width;
        this.canvas.height = size.height;
    }

    // Cargar un personaje
    loadPlayer(x, y, width, height, imgPath, type, stats) {
        this.player = new Being(x, y, width, height, imgPath, type, stats);
        console.log(this.player);
    }


    // Método para iniciar el juego
    start() {
        if (!this.player) {
            console.error("No se ha cargado un jugador.");
            return;
        }
    
        // Solo se llama una vez al iniciar el juego
        if (this.map.map.length === 0) {
            const mapEntities = this.map.initialize(); 
            this.player.mapObjects = mapEntities; // Asigna las entidades iniciales al jugador
        }
        
    
        this.drawLoop(); // Inicia el bucle de dibujo
    }
     // Dibuja los objetos del mapa
     drawMap() {
        // Filtrar entidades fuera de la vista
        const visibleEntities = this.map.map.filter(entity => {
            return (
                entity.x + entity.width >= this.player.x - this.canvas.width / 2 &&
                entity.x <= this.player.x + this.canvas.width / 2 &&
                entity.y + entity.height >= this.player.y - this.canvas.height / 2 &&
                entity.y <= this.player.y + this.canvas.height / 2
            );
        });
        
        // Dibuja solo las entidades visibles
        visibleEntities.forEach(entity => {
            entity.draw(this.context);
        });
    }
     // Dibujo del juego
     draw() {
        this.clearCanvas();
        this.drawMap();

        
        this.player.draw(this.context);
        move(this.player);
    
        // FPS y APS en pantalla
        this.context.fillStyle = 'black';
        this.context.fillText(`FPS: ${mainLoop.fps}`, 10, 20);
        this.context.fillText(`APS: ${mainLoop.aps}`, 10, 40);
    }
    drawLoop() {
        this.clearCanvas();
        this.draw();
        // Evitar cualquier referencia innecesaria al mapa
        // Por ejemplo, asegurarte de que advanceChunk solo se llame bajo ciertas condiciones
        if (this.player.x > this.canvas.width / 2) {
            const newChunks = this.map.advanceChunk();
            if (newChunks.length > 0) {
                this.player.mapObjects.push(...newChunks);
            }
        }
    }
    // Limpiar el canvas
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
export {Game}