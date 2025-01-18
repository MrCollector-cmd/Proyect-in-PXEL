const imagesController = {
    imageCache: {},

    // Cargar una imagen y agregarla al caché
    loadImage(path) {
        if (!this.imageCache[path]) {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }
        return this.imageCache[path];
    },

    // Pre-cargar un conjunto de imágenes y esperar a que se carguen
    preloadImages(imagePaths) {
        const promises = imagePaths.map(path => {
            return new Promise((resolve, reject) => {
                const img = this.loadImage(path);
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Error loading image: ${path}`));
                }
            });
        });
        return Promise.all(promises);
    },

    // Obtener la imagen desde el caché
    getImage(path) {
        return this.imageCache[path];
    },

    // Limpiar todo el caché de imágenes
    clearCache() {
        this.imageCache = {};
    }
};

export { imagesController };