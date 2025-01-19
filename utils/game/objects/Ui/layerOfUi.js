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
            console.warn('No se ha cargado un jugador');
            return;
        }
        UI.infoViw.life = UI.dataPlayer.stats.heal; // Vida actual
        UI.infoViw.dash = UI.dataPlayer.stats.dash; // Dash actual
    },

    drawUi: function (ctx) {
        // Usar el imagesController para cargar la imagen desde el caché
        const img = imagesController.loadImage(this.srcInf);
        const height = size.tils * 1.5;
        const width = size.tils * 5;

        // Verificar si la imagen está cargada antes de dibujar
        if (img.complete && img.width !== 0) {
            const adjustedX = 0; // Ajustar posición horizontal con el offset
            const adjustedY = 0; // Ajustar posición vertical con el offset

            // Dibujar la imagen en la esquina superior izquierda
            ctx.drawImage(img, adjustedX, adjustedY, width, height);
        }
    },
    drawPorcent: function (ctx) {
        if (UI.dataPlayer == null || UI.infoViw.life == null || UI.infoViw.dash == null) {
            console.warn("No se pueden dibujar las barras: faltan datos del jugador.");
            return;
        }
    
        // Configuración de la barra de vida
        const maxBarWidth = size.tils * 3.28; // Ancho máximo de la barra (100% vida)
        const barHeight = size.tils * 0.65; // Altura de la barra
        const barX = size.tils * 1.6; // Posición X
        const barY = size.tils * 0.1; // Posición Y
    
        // Calcular el ancho de la barra de vida según la vida actual
        const maxLife = UI.dataPlayer.stats.maxHeal; // Vida máxima del jugador
        const currentLife = UI.infoViw.life; // Vida actual del jugador
        const currentLifeBarWidth = (currentLife / maxLife) * maxBarWidth;
    
        // Dibujar la barra de vida (roja)
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, currentLifeBarWidth, barHeight);
    
        // Configuración de la barra de stamina
        const staminaBarY = barHeight + size.tils * 0.1; // Posición Y debajo de la barra de vida
    
        // Calcular el ancho de la barra de stamina según la stamina actual
        const maxStamina = UI.dataPlayer.stats.maxStamina; // Stamina máxima del jugador
        const currentStamina = UI.infoViw.dash; // Stamina actual del jugador
        const currentStaminaBarWidth = (currentStamina / maxStamina) * maxBarWidth;
    
        // Dibujar la barra de stamina (verde)
        ctx.fillStyle = '#bd8b11';
        ctx.fillRect(barX, staminaBarY, currentStaminaBarWidth, barHeight);
    }
};

export { UI };