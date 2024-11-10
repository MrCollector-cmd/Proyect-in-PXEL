import { Rect } from "../rect.js";
import { size } from "../size.js";
function Game(player){
    this.p = player;
    this.map = new Rect(2 * size.tils,4 * size.tils,400,100,'solid');
    this.pColl = false;
    this.map.insertDOM()

    this.gameLoop();
}

Game.prototype.gameLoop = function() {
    // Apply gravity first
    this.p.gravity(this.pColl);
    
    // Update player position
    this.p.move();
    
    // Check collisions
    if (this.map.intersec(this.p.player)) {
        this.pColl = true;
        this.p.handleCollision(this.map);
    } else {
        this.pColl = false;
    }
    
    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
}
export {Game}