let size = {
    width: (window.innerWidth || document.body.clientWidth) ,
    height: window.innerHeight || document.body.clientHeight,
    tils: 60,
    scale: 1,
    initSize: function() {  
        window.addEventListener('resize', function() {
            size.width = window.innerWidth; // Actualizar width a la mitad del ancho de la ventana
            size.height = window.innerHeight;
        });
    },
    getTilesWitdth: function() {
        var tilsFin = size.scale * size.tils;
        return Math.ceil((size.width - tilsFin) / tilsFin);
    },
    getTilesHeight: function() {
        var tilsFin = size.scale * size.tils;
        return Math.ceil((size.height - tilsFin) / tilsFin);
    },
    getTotalTiles: function() {
        return size.getTilesHeight() * size.getTilesWitdth();
    },
    getPxHeight: function() {
        return size.height;
    }
};

export { size };