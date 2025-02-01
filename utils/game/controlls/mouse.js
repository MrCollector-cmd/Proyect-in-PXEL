import { imagesController } from "../../configs/imagesController.js";
import { contextThisGame } from "../objects/context.js";
let mouseControlls = {
    mouseClick:false,
    mouseOut: false,
    img: null, // Lo dejamos como null inicialmente
    height: 60,
    width: 60,
    offsetX: null,
    offsetY: null,
    clickPosition: { x: null, y: null }, // Posición del clic más reciente
    elementPosition: null, // posicion
    getPosMouse: function() {
        if (mouseControlls.offsetX === null || mouseControlls.offsetY === null && !mouseControlls.mouseOut) {
            addEventListener('mousemove', (e) => {
                mouseControlls.width = 60;
                mouseControlls.height = 60;
                mouseControlls.offsetX = e.clientX; 
                mouseControlls.offsetY = e.clientY; 
                mouseControlls.mouseOut = true;
            });
        }
        else {
            addEventListener('mouseout', () => {
                mouseControlls.width = 0;
                mouseControlls.height = 0;
                mouseControlls.mouseOut = false;
            });
        }
        return {posX: mouseControlls.offsetX, posY: mouseControlls.offsetY, mouseOut: mouseControlls.mouseOut};
    },
    
     // Detectar cuándo el botón del ratón se pulsa y se suelta
     handleMousePress: function() {
        const canvas = document.getElementById("gameWorld");
    
        canvas.addEventListener('mousedown', (e) => {
            if (mouseControlls.mouseClick == false) {
                // Registra la posición del clic solo si no hay un clic previo registrado
                const rect = canvas.getBoundingClientRect();
                mouseControlls.clickPosition.x = e.clientX - rect.left; // Posición relativa al canvas
                mouseControlls.clickPosition.y = e.clientY - rect.top;  // Posición relativa al canvas
                mouseControlls.mouseClick = true
            }
        },{once:true});
    
        canvas.addEventListener('mouseup', () => {
            // Restablece la posición del clic cuando se suelta el botón
            if (mouseControlls.clickPosition.x !== null && mouseControlls.clickPosition.y !== null) {
                console.log('Mouse liberado');
                mouseControlls.clickPosition.x = null;
                mouseControlls.clickPosition.y = null;
                mouseControlls.mouseClick = false
            }
        },{once:true});
    },
    handleClick: function() {
        return new Promise((resolve) => {
            addEventListener('click', (e) => {
                resolve(e); // Devuelve el evento 'e' a través de la promesa
            }, { once: true }); // Usa { once: true } para eliminar automáticamente el listener después de un clic
        });
    },
    
    loadMouseImage: function() {
        // Carga la imagen del puntero desde el caché
        mouseControlls.img = imagesController.loadImage("src/pointer/pointer1.png");
    },

    styleMouse: function(context) {
        if (mouseControlls.img && mouseControlls.img.complete && mouseControlls.img.width !== 0) {
            context.drawImage(
                mouseControlls.img,
                mouseControlls.offsetX - mouseControlls.width / 2, // Posición X del puntero
                mouseControlls.offsetY - mouseControlls.height / 2, // Posición Y del puntero
                mouseControlls.height,                            // Ancho del puntero
                mouseControlls.width                              // Alto del puntero
            );
        } else {
            console.warn(`Imagen aún no cargada: ${mouseControlls.img.src}`);
        }
    },

    refreshMouseStyle: function() {
        let context = document.getElementById("gameWorld").getContext('2d');
        mouseControlls.getPosMouse();
        mouseControlls.styleMouse(context);
    }
};

// Pre-cargar la imagen cuando el módulo se inicializa
mouseControlls.loadMouseImage();

export { mouseControlls };