import { Rect } from "../../rect.js"
import { size } from "../../size.js"
function Player(x,y){
    this.player = new Rect(x * size.tils,y * size.tils,100,100,'solid');
    this.gravity();

}
// ?///////////////// aca esta el problema ///////////////////
Player.prototype.gravity = function(){
    let div = document.getElementById(this.player.id);
    let yPos = parseInt(div.style.top, 10);

    function aplicarGravedad() {
        yPos += 3; // Velocidad de caída (ajusta según sea necesario)
        div.style.top = `${yPos}px`;
        console.log(div.style)
        requestAnimationFrame(aplicarGravedad);
    }
////////////////////////////////////////////////////////////////
};


export {Player}