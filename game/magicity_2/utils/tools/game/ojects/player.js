import { keyboard } from "../../keyboard.js";
import { Rect } from "../../rect.js"
import { size } from "../../size.js"
function Player(x,y){
    this.player = new Rect(x * size.tils,y * size.tils,100,100,'solid');
    this.gravity();
}
Player.prototype.move = function(){
    const traslate = (key)=>{
        switch (key) {
            case "a":
                let div = document.getElementById(this.player.id);
                let pos = parseInt(div.style.left, 10);
                pos += 3; // Velocidad de caída (ajusta según sea necesario)
                div.style.left = `${yPos}px`;
                this.player.y = parseInt(div.style.left, 10);
                break;
            case "d":
                
                break;
            case "w":
                
                break;
            case "s":
                
                break;
        }
    }
    const inMove = ()=>{
        console.log(keyboard.keyDown())
        document.addEventListener('onkeydown',()=>{
            console.log('sdasd')
        })
    }
    inMove()
}
// ?///////////////// aca esta el problema ///////////////////
Player.prototype.gravity = function(pColl){
    let div = document.getElementById(this.player.id);
    let yPos = parseInt(div.style.top, 10);
    const insGracity = ()=>{
        if (yPos >= 0 && yPos < size.height - 100 && pColl === false) {
            yPos += 1; // Velocidad de caída (ajusta según sea necesario)
            div.style.top = `${yPos}px`;
            this.player.y = parseInt(div.style.top, 10);
        }else{
            div.style.top = `${yPos}px`;
            this.player.y = parseInt(div.style.top, 10);
        }
    }
    insGracity();
////////////////////////////////////////////////////////////////
};


export {Player}