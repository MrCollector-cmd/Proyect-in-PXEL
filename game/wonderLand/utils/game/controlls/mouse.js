import { imagesController } from "../../configs/imagesController.js";
let mouseControlls = {
    mouseOut: false,
    img: null, // Lo dejamos como null inicialmente
    height: 60,
    width: 60,
    offsetX: null,
    offsetY: null,

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