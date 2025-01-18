import { imagesController } from "../../../configs/imagesController.js";
import { size } from "../../../configs/size.js";

const UI = {
    dataPlayer: null,
    srcInf: 'src/ui/prev.png',
    infoViw: {
        life: null,
        dash: null
    },

    getData: function () {
        if (UI.dataPlayer == null) {
            console.warn('No se a cargado un Jugador')
            return
        }
        UI.infoViw.life = UI.dataPlayer.stats.heal;
        UI.infoViw.dash = UI.dataPlayer.stats.dash;
    },

    drawUi: function (ctx) {
        // Usar el imagesController para cargar la imagen desde el caché
        const img = imagesController.loadImage(this.srcInf);
        const height = size.tils * 1.5
        const width = size.tils * 5

        // Verificar si la imagen está cargada antes de dibujar
        if (img.complete && img.width !== 0) {
            const adjustedX = 0; // Ajustar posición horizontal con el offset
            const adjustedY = 0; // Ajustar posición vertical con el offset

            // Dibujar la imagen en la esquina superior izquierda
            ctx.drawImage(img, adjustedX, adjustedY, width, height);
        }
    }
};

export { UI };
