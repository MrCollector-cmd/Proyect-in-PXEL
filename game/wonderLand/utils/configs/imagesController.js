const imagesController = {
    imageCache: {},

    // Cargar una imagen y agregarla al caché
    loadImage(path) {
        if (!this.imageCache[path]) {
            const img = new Image();
            img.src = path;

            // Agregar la imagen al caché cuando se carga completamente
            img.onload = () => {
                this.imageCache[path] = img;
            };

            // Guardamos una referencia provisional mientras carga
            this.imageCache[path] = img;
        }
        return this.imageCache[path];
    },

    // Pre-cargar un conjunto de imágenes
    preloadImages(imagePaths) {
        imagePaths.forEach((path) => {
            this.loadImage(path); // Usar this para acceder a loadImage dentro del objeto
        });
    },

    // Obtener la imagen desde el caché
    getImage(path) {
        return this.imageCache[path];
    },

    // Limpiar todo el caché de imágenes
    clearCache() {
        for (let key in this.imageCache) {
            delete this.imageCache[key];
        }
    }
};

export { imagesController };