import { Criature } from "./rect.js";
import { size } from "../../configs/size.js";
import { mainLoop } from "../../mainLoop.js/mainLoop.js";
import { Map } from "./map.js";
class Game {
    constructor() {
        // Crear el canvas
        this.canvas = document.getElementById('gameWorld');
        this.updateCanvasSize();
        this.canvas.style.border = '1px solid black';
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.mouseX = 0;
        this.mouseY = 0;
        this.player = null;

        this.map = new Map(5); // Configurar un número inicial de chunks

        this.cameraOffsetX = 0; // Desplazamiento de la cámara en X
        this.cameraOffsetY = 0; // Desplazamiento de la cámara en Y

        this.centralArea = {
            width: this.canvas.width / 3, // 1/3 del ancho del canvas
            height: this.canvas.height / 3, // 1/3 de la altura del canvas
        };

        this.loadPlayer(20, 20, 50, 60, "src/skins/skinD.png", "player", { heal: 10, damage: 10 });
        this.setupMouseListeners();
    }

    setupMouseListeners() {
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;
        });
    }

    updateCanvasSize() {
        this.canvas.width = size.width;
        this.canvas.height = size.height;
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

        this.drawLoop();
    }

    updateCamera() {
        // Define el centro del área central
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        // Bordes del área central
        const leftBoundary = centerX - this.centralArea.width / 2;
        const rightBoundary = centerX + this.centralArea.width / 2;
        const topBoundary = centerY - this.centralArea.height / 2;
        const bottomBoundary = centerY + this.centralArea.height / 2;

        // Ajustar desplazamiento de la cámara si el mouse está fuera del área central
        if (this.mouseX < leftBoundary) {
            this.cameraOffsetX -= (leftBoundary - this.mouseX);
        } else if (this.mouseX > rightBoundary) {
            this.cameraOffsetX += (this.mouseX - rightBoundary);
        }

        if (this.mouseY < topBoundary) {
            this.cameraOffsetY -= (topBoundary - this.mouseY);
        } else if (this.mouseY > bottomBoundary) {
            this.cameraOffsetY += (this.mouseY - bottomBoundary);
        }
    }

    drawMap() {
        this.map.map.forEach(entity => {
            // Dibujar teniendo en cuenta el desplazamiento de la cámara
            entity.draw(this.context, this.cameraOffsetX, this.cameraOffsetY);
        });
    }

    draw() {
        this.clearCanvas();
        this.updateCamera(); // Actualizar la posición de la cámara
        this.drawMap();
        this.player.draw(this.context, this.cameraOffsetX, this.cameraOffsetY); // Dibujar el jugador con desplazamiento
        this.player.move()
        // FPS y APS en pantalla
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
export {Game}