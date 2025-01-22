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

    // Limpiar todo el caché de imágenes almacenado en memoria
    clearCache() {
        this.imageCache = {};
    },

    // Limpiar las imágenes almacenadas en la Cache API del navegador
    async clearImageCache() {
        const cacheKeys = await caches.keys(); // Obtiene todos los nombres de caché
        for (const cacheName of cacheKeys) {
            const cache = await caches.open(cacheName); // Abre cada caché
            const requests = await cache.keys(); // Obtiene todas las solicitudes en el caché

            for (const request of requests) {
                if (request.url.endsWith('.png') || request.url.endsWith('.jpg') || request.url.endsWith('.jpeg') || request.url.endsWith('.gif')) {
                    await cache.delete(request); // Elimina imágenes con extensiones específicas
                    console.log(`Imagen eliminada del caché: ${request.url}`);
                }
            }
        }
    }
};

export { imagesController };
