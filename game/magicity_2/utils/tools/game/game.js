import { Rect } from "../rect.js";
import { size } from "../size.js";

function Game(player,map){
    this.player = player;
    this.map = map;
    
    
    var map = new Rect(2 * size.tils,4 * size.tils,400,100,'solid').insertDOM()
}
export {Game}