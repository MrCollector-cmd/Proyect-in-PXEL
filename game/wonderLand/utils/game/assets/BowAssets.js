//carga las imagenes del arco
const BowAssets = {
    frames: {
        frame1: new Image(),
        frame2: new Image(),
        frame3: new Image()
    },
    
    sizes: {
        inventory: {
            width: 25,
            height: 55
        },
        hand: {
            width: 15,
            height: 60
        }
    },

    //inicializa las imagenes del arco
    init() {
        this.frames.frame1.src = "src/weapons/BowFrame1.png";
        this.frames.frame2.src = "src/weapons/BowFrame2.png";
        this.frames.frame3.src = "src/weapons/BowFrame3.png";
    },

    //obtiene las imagenes del arco
    getFrames() {
        return this.frames;
    },

    //obtiene los tamaños del arco
    getSizes() {
        return this.sizes;
    },

    //verifica si las imagenes estan cargadas
    areImagesLoaded() {
        return Object.values(this.frames).every(img => img && img.complete);
    }
};

// Inicializamos las imágenes
BowAssets.init();

export { BowAssets }; 