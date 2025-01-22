import { imagesController } from "../../../configs/imagesController.js";
import { size } from "../../../configs/size.js";
import { contextThisGame } from "../context.js";
const UI = {
    dataPlayer: null,
    dataInventory:null,
    srcInf: 'src/ui/prev.png',
    srcInv: {inv:"src/ui/inventaryFast.png",xpBar:"src/ui/xpBar.png"},
    infoViw: {
        life: null,
        dash: null,
        xp:null,
    },

    getData: function () {
        if (UI.dataPlayer == null) {
            console.warn('No se ha cargado un jugador');
            return;
        }
        UI.infoViw.life = UI.dataPlayer.stats.heal; // Vida actual
        UI.infoViw.dash = UI.dataPlayer.stats.dash; // Dash actual
        UI.infoViw.xp = UI.dataPlayer.stats.xp; // Dash actual
    },

    drawUi: function (ctx) {
        // Usar el imagesController para cargar la imagen desde el caché
        // Dibujo de HP y STAMINA
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
    
        // ** Nueva altura y anchura personalizadas para inv y xpBar **
        const invWidth = size.tils * 8; // Ancho del inventario
        const xpBarWidth = size.tils * 8; // Ancho de la barra de XP
        const invHeight = size.tils * 1; // Altura del inventario (ajustar según necesidad)
        const xpBarHeight = size.tils * 0.4; // Altura de la barra de XP (ajustar según necesidad)
    
        // Calcular la posición horizontal centralizada
        const screenWidth = ctx.canvas.width; // Ancho total del canvas
        const invX = (screenWidth - invWidth) / 2;
        const xpBarX = (screenWidth - xpBarWidth) / 2;
    
        // Calcular la posición Y (ambos se dibujan en la parte inferior de la pantalla)
        const yPosition = ctx.canvas.height - invHeight - xpBarHeight - size.tils * 0.0001; // Ajusta el espacio entre inv y xpBar
    
        // Cargar las imágenes del inventario y la barra de XP
        const invImg = imagesController.loadImage(this.srcInv.inv);
        const xpBarImg = imagesController.loadImage(this.srcInv.xpBar);
    
        // Establecer la opacidad para el inventario
        ctx.globalAlpha = 0.4; // Reducir opacidad al 50%
    
        // Verificar si las imágenes están cargadas antes de dibujar
        if (invImg.complete && invImg.width !== 0) {
            ctx.drawImage(invImg, invX, yPosition, invWidth, invHeight); // Dibuja el inventario con la altura ajustada
        }
    
        // Restaurar la opacidad para la barra de XP (opacidad normal)
        ctx.globalAlpha = 1.0; // Restaurar opacidad al 100%
    
        if (xpBarImg.complete && xpBarImg.width !== 0) {
            ctx.drawImage(xpBarImg, xpBarX, yPosition - xpBarHeight - size.tils * 0.1, xpBarWidth, xpBarHeight); // Dibuja la barra de XP con la altura ajustada
        }
    },
    
    drawPorcent: function (ctx) {
        if (UI.dataPlayer == null || UI.infoViw.life == null || UI.infoViw.dash == null || UI.infoViw.xp == null) {
            console.warn("No se pueden dibujar las barras: faltan datos del jugador.");
            return;
        }
    
        // Configuración de la barra de vida
        
        const maxBarWidth = size.tils * 3.28; // Ancho máximo de la barra (100% vida)
        const barHeight = size.tils * 0.65; // Altura de la barra
        const barX = size.tils * 1.6; // Posición X
        const barY = size.tils * 0.1; // Posición Y para la barra de vida
    
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
    
        // **Colocar la barra de XP en el mismo lugar que la barra de vida**
        const xpBarHeight = size.tils * 0.3; // Altura de la barra de XP
        const xpBarWidth = size.tils * 7.85; // Ancho de la barra de XP
        const yPosition = ctx.canvas.height - xpBarHeight - size.tils * 1.55
        // Calcular el ancho de la barra de XP según los puntos de XP actuales
        const maxXp = UI.dataPlayer.stats.maxXp; // XP máximo (100 puntos)
        const currentXp = UI.infoViw.xp; // Puntos de XP actuales
        const currentXpBarWidth = (currentXp / maxXp) * xpBarWidth;
        // Calcular la posición horizontal centralizada
        const screenWidth = ctx.canvas.width; // Ancho total del canvas
        const xpBarX = (screenWidth - xpBarWidth) / 2;
    
        // Dibujar la barra de XP (verde)
        ctx.fillStyle = 'green';
        ctx.fillRect(xpBarX, yPosition, currentXpBarWidth, xpBarHeight); // Usar barY para la misma posición
    },
    drawInventory:function(ctx){
        if(this.dataInventory.isOpen == false){
            return
        }
        this.dataInventory.draw(ctx,contextThisGame.player)
    }
};

export { UI };