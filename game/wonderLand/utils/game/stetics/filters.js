const filters = {
    color: null,
    height: window.innerHeight,
    width: window.innerWidth,

    createAndDrawFilter: function (context) {
        if (filters.requestPropertis()) {
            context.fillStyle = `rgba(${filters.color.r}, ${filters.color.g}, ${filters.color.b}, ${filters.color.opacity})`;
            context.fillRect(0, 0, filters.width, filters.height);
            context.globalAlpha = 1.0; // Restaurar la opacidad a su valor predeterminado
        } else {
            console.warn('Verifique el valor de las propiedades');
        }
    },

    requestPropertis: function () {
        if (filters.color == null || filters.height == null || filters.width == null) {
            console.error("Al parecer hay alguna propiedad sin valor");
            return false;
        } else {
            return true;
        }
    },
    filterOfLimit: function (ctx, width, height, x, y, cameraX = 0, cameraY = 0) {
        // Asegurarnos de que el gradiente se dibuje correctamente dentro del canvas
        const maxY = Math.min(y, ctx.canvas.height);
    
        // Crear un gradiente lineal de abajo hacia arriba
        const gradiente = ctx.createLinearGradient(0, maxY, 0, maxY - height / 4);
    
        // Agregar los colores al gradiente (de negro con opacidad a transparente)
        gradiente.addColorStop(0, 'rgba(0, 0, 0, 0.7)'); // Negro opaco
        gradiente.addColorStop(1, 'rgba(0, 0, 0, 0)');   // Transparente al final
    
        // Aplicar el gradiente como relleno
        ctx.fillStyle = gradiente;
    
        // Dibujar el rectángulo con el gradiente ajustado por las coordenadas del canvas
        // Desplazamos el gradiente teniendo en cuenta la posición de la cámara y asegurándonos
        // de que no salga de la zona visible
        ctx.fillRect(x - cameraX, maxY - cameraY, width, height);
    },
    drawBackground: function (ctx, type = 'gradient', options = {}) {
        // Si el tipo de fondo es 'blur', aplicar solo el desenfoque
        if (type === 'blur') {
            // Aplicar un filtro de desenfoque si se especifica en las opciones
            if (options.blur) {
                ctx.filter = `blur(${options.blur}px)`; // Aplicar blur con el valor de `options.blur`
            }
    
            // Restaurar el filtro al finalizar
            ctx.filter = 'none';
            return; // Terminar la función aquí para no aplicar otros tipos de fondo
        }
        if (options.blur) {
            ctx.filter = `blur(${options.blur}px)`; // Aplicar blur con el valor de `options.blur`
        }
        // Si no es 'blur', se maneja según el tipo de fondo
        switch (type) {
            case 'gradient':
                // Dibujar un gradiente de fondo
                const gradient = ctx.createLinearGradient(0, 0, 0, filters.height);
                gradient.addColorStop(0, options.startColor || 'rgba(0, 150, 255, 1)'); // Color inicial
                gradient.addColorStop(1, options.endColor || 'rgba(0, 50, 100, 1)'); // Color final
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, filters.width, filters.height);
                break;
    
            case 'solid':
                // Dibujar un color sólido de fondo
                ctx.fillStyle = options.color || 'rgba(0, 0, 0, 1)'; // Color por defecto si no se pasa uno
                ctx.fillRect(0, 0, filters.width, filters.height);
                break;
    
            case 'image':
                // Dibujar una imagen de fondo
                const image = options.image; // La imagen debe estar cargada previamente
                ctx.drawImage(image, 0, 0, filters.width, filters.height); // Dibuja el canvas a tamaño completo del canvas
                break;
    
            case 'shadowsX':
                // Crear un gradiente radial similar al CSS que mencionaste
                const gradiente = ctx.createRadialGradient(
                    filters.width / 2, filters.height / 2, 0, // Centro del gradiente (en el medio del canvas)
                    filters.width / 2, filters.height / 2, filters.width / 1.5 // Radio más grande para cubrir más área
                );
                
                // Definir los colores del gradiente con una transición más suave
                gradiente.addColorStop(0, 'rgba(0, 0, 0, 0)');       // Transparente en el centro
                gradiente.addColorStop(0.6, 'rgba(0, 0, 0, 0.0)');   // Suave transición hacia un gris claro
                gradiente.addColorStop(0.8, 'rgba(0, 0, 0, 0.5)');   // Gris más oscuro
                gradiente.addColorStop(1, 'rgba(0, 0, 0, 1)');       // Negro en los bordes
                
                // Aplicar el gradiente como fondo
                ctx.fillStyle = gradiente;
                ctx.fillRect(0, 0, filters.width, filters.height); // Dibuja el fondo cubriendo todo el canvas
                break;
    
            default:
                console.warn('Tipo de fondo no reconocido. Usa "gradient", "solid", "image", etc.');
        }
    
        // Restaurar el filtro al finalizar el dibujo (esto asegura que no se aplique el filtro a otros elementos)
        ctx.filter = 'none';
    }
    
};

export { filters };
