//carga las imagenes del arco
const CrossbowAssets = {
    frames: {
        frame1: new Image(),
    },
    
    sizes: {
        inventory: {
            width: 60,
            height: 60
        },
        hand: {
            width: 25,
            height: 40
        }
    },

    //inicializa las imagenes del arco
    init() {
        // Asignamos la fuente y cargamos la imagen
        this.frames.frame1.src = "src/weapons/distanceWeapons/nyanGun.png";

        // Añadir un manejador de evento onload para asegurar que la imagen esté cargada
        this.frames.frame1.onload = () => {
            console.log('Imagen cargada correctamente');
        };

        // Añadir un manejador de evento onerror para detectar si hubo algún problema al cargar la imagen
        this.frames.frame1.onerror = () => {
            console.error('Error al cargar la imagen');4
        };
    },

    //obtiene las imagenes del arco
    getFrames() {
        return this.frames;
    },

    //obtiene los tamaños del arco
    getSizes() {
        return this.sizes;
    }
};

// Inicializamos las imágenes solo una vez
CrossbowAssets.init();

export { CrossbowAssets };