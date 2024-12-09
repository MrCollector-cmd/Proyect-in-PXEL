const filters = {
    color: null,
    height: window.innerHeight,
    width: window.innerWidth,
    createAndDrawFilter: function(context) {
        if(filters.requestPropertis()){
            context.fillStyle = `rgba(${filters.color.r}, ${filters.color.g}, ${filters.color.b}, ${filters.color.opacity})`; // Establecer el color de la capa (negro)
            context.fillRect(0, 0, filters.width, filters.height); // Dibuja el rectángulo que cubre todo el canvas
            context.globalAlpha = 1.0;  // Restaurar la opacidad a su valor predeterminado 
        }else{
            console.warn('Verifique el valor de las pripiedades')
        }
    },
    requestPropertis:function(){
        if (filters.color == null && filters.height == null && filters.width == null) {
            console.error("Al parecer hay alguna propiedad sin valor");
            return false;
        }else{
            return true
        };
    },
    filterOfLimit:function (ctx,width,height,x,y) {
        // Crea un gradiente lineal de arriba a abajo
        const gradiente = ctx.createLinearGradient(0, height- 130, 0, height - 200);

        // Agrega los colores al gradiente (de negro a transparente)
        gradiente.addColorStop(0, 'rgba(0, 0, 0, 0.7)');      // Color negro en la parte superior
        gradiente.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Transparente en la parte inferior

        // Aplica el gradiente como estilo de relleno
        ctx.fillStyle = gradiente;

        // Dibuja un rectángulo que cubra todo el canvas
        ctx.fillRect(y, x, width, height);
    }
}

export {filters}