let mouseControlls = {
    mouseOut: false,
    img:new Image(),
    height: 60,
    width: 60,
    offsetX: null,
    offsetY: null,
    getPosMouse:function() {
        if (mouseControlls.offsetX === null || mouseControlls.offsetY === null && mouseControlls.mouseOut) {
            addEventListener('mousemove', (e) => {
                mouseControlls.width = 60
                mouseControlls.height = 60
                mouseControlls.offsetX = e.clientX; 
                mouseControlls.offsetY = e.clientY; 
            });
        }
        else if(!mouseControlls.mouseOut){
            addEventListener('mouseout', () => {
                mouseControlls.width = 0
                mouseControlls.height = 0
            })
        }
    },
    styleMouse:function(context) {
        mouseControlls.img.src = "src/pointer/pointer1.png";
        if (mouseControlls.img.complete && mouseControlls.img.width !== 0) {
            context.drawImage(
                mouseControlls.img,
                mouseControlls.offsetX - mouseControlls.width/2, // Posición X del tile
                mouseControlls.offsetY - mouseControlls.height/2, // Posición Y del tile
                mouseControlls.height,              // Ancho del tile
                mouseControlls.width             // Alto del tile
            );
        } else {
            console.warn(`Imagen aún no cargada: ${mouseControlls.img.src}`);
        }
    },
    refreshMouseStyle:function() {
        let context = document.getElementById("gameWorld").getContext('2d')
        mouseControlls.getPosMouse();
        mouseControlls.styleMouse(context)
    }
}

export {mouseControlls}