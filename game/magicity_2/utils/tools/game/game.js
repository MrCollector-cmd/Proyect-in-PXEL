import { Rect } from "../rect.js";
import { size } from "../size.js";
function Game(player){
    this.p = player;
    this.map = new Rect(2 * size.tils,4 * size.tils,400,100,'solid');
    this.pColl = false;
    this.map.insertDOM()
    this.p.gravity(this.pColl)

    const coll=(pla, map)=> {
        if(map.intersec(pla.player)) {
            return true;
        }else{return false}
    }
    const checkCollision= ()=> {
        if (coll(this.p, this.map)) {
            this.pColl = true
            this.p.gravity(this.pColl)
        }else{
            this.pColl = false
            this.p.gravity(this.pColl)
        }
        requestAnimationFrame(checkCollision);
    }
    
    // Inicia la comprobación de colisión
    checkCollision()
}
export {Game}