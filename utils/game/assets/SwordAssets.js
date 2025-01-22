const SwordAssets = {
    frames: {
        frame1: new Image(),
    },
    
    sizes: {
        inventory: {
            width: 40,
            height: 10
        },
        hand: {
            width: 135,
            height: 25
        }
    },

    //inicializa las imagenes del arco
    init() {
        // Asignamos la fuente y cargamos la imagen
        this.frames.frame1.src = "src/weapons/swords/katana.png";

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
SwordAssets.init();
export {SwordAssets}