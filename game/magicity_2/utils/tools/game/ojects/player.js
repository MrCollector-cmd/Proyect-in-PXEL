import { keyboard } from "../../keyboard.js";
import { Rect } from "../../rect.js"
import { size } from "../../size.js"

function Player(x,y){
    this.player = new Rect(x * size.tils,y * size.tils,100,100,'solid');
    this.moveSpeed = 5;
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 8;
    this.friction = 0.85;
    this.isMoving = false;
    this.gravitySpeed = 0.5;
    this.jumpForce = -15;
    this.isGrounded = false;
    
    console.log('Player created at:', this.player.x, this.player.y);
}

Player.prototype.move = function(){
    // Get current position
    let newX = this.player.x;
    
    // Horizontal movement
    if (keyboard.keyDown('a')) {
        newX -= this.moveSpeed;
        console.log('Moving left');
    }
    if (keyboard.keyDown('d')) {
        newX += this.moveSpeed;
        console.log('Moving right');
    }

    // Jump only if grounded and W is pressed
    if (keyboard.keyDown('w') && this.isGrounded) {
        this.velocity.y = this.jumpForce;
        this.isGrounded = false;
        console.log('Jumping');
    }

    // Update horizontal position
    this.player.x = newX;

    // Update vertical position based on velocity
    this.player.y += this.velocity.y;

    // Update DOM element
    let div = document.getElementById(this.player.id);
    if (div) {
        div.style.left = `${this.player.x}px`;
        div.style.top = `${this.player.y}px`;
    }
}

Player.prototype.gravity = function(pColl){
    if (pColl) {
        // If colliding with something, stop falling and set as grounded
        this.velocity.y = 0;
        this.isGrounded = true;
    } else {
        // Apply gravity by increasing vertical velocity
        this.velocity.y += this.gravitySpeed;
        this.isGrounded = false;
    }

    // Terminal velocity (maximum fall speed)
    if (this.velocity.y > 10) {
        this.velocity.y = 10;
    }

    // Check bottom boundary of screen
    if (this.player.y + this.player.height > size.height) {
        this.player.y = size.height - this.player.height;
        this.velocity.y = 0;
        this.isGrounded = true;
    }
}

Player.prototype.handleCollision = function(object) {
    if (this.player.intersec(object)) {
        // Get the collision depths
        let leftDepth = (this.player.x + this.player.width) - object.x;
        let rightDepth = (object.x + object.width) - this.player.x;
        let topDepth = (this.player.y + this.player.height) - object.y;
        let bottomDepth = (object.y + object.height) - this.player.y;

        // Find the smallest depth
        let minDepth = Math.min(leftDepth, rightDepth, topDepth, bottomDepth);

        // Resolve collision based on the smallest depth
        if (minDepth === topDepth) {
            // Landing on top of the object
            this.player.y = object.y - this.player.height;
            this.velocity.y = 0;
            this.isGrounded = true;
        } else if (minDepth === bottomDepth) {
            // Hitting bottom of the object
            this.player.y = object.y + object.height;
            this.velocity.y = 0;
        } else if (minDepth === leftDepth) {
            // Hitting left side of the object
            this.player.x = object.x - this.player.width;
        } else if (minDepth === rightDepth) {
            // Hitting right side of the object
            this.player.x = object.x + object.width;
        }
    }
}

// Modify the Rect class to ensure the div is properly styled
Rect.prototype.insertDOM = function(){
    var div = `<div id="${this.id}" style="
        position: absolute;
        left: ${this.x}px;
        top: ${this.y}px;
        width: ${this.width}px;
        height: ${this.height}px;
        background-color: ${this.getRandomColor()};
    "></div>`;
    
    document.getElementById("game").innerHTML += div;
    console.log('Rect created with ID:', this.id);
    return this.id;
};

// Add this helper method to Rect
Rect.prototype.getRandomColor = function() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

export {Player}