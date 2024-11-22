function Rect(x,y,width,height,type){
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.type = type;
    this.id = `r${x}${y}`
    this.insertDOM();
}

Rect.prototype.insertDOM = function(){
    var div = `<div id="${this.id}" ></div>`;
    var html = document.getElementById("game-world").innerHTML;
    var color = `#${Math.floor(Math.random()*16777215).toString(16)}`
    document.getElementById('game-world').innerHTML = html + div;
    document.getElementById(this.id).style.position = 'absolute';   
    document.getElementById(this.id).style.left = `${this.x}px`;   
    document.getElementById(this.id).style.top = `${this.y}px`; 
    document.getElementById(this.id).style.width = `${this.width}px`;
    document.getElementById(this.id).style.height = `${this.height}px`;  
    document.getElementById(this.id).style.opacity = `${0.5}`;  
    document.getElementById(this.id).style.backgroundColor = `${color}`;
    return this.id
};
Rect.prototype.checkCollision = function(rect) {
    // Verificar si hay solapamiento en el eje X e Y
    let collisionX = this.x < rect.x + rect.width && this.x + this.width > rect.x;
    let collisionY = this.y < rect.y + rect.height && this.y + this.height > rect.y;

    if (collisionX && collisionY) {
        // Determinar el lado de la colisión
        let overlapLeft = rect.x + rect.width - this.x;
        let overlapRight = this.x + this.width - rect.x;
        let overlapTop = rect.y + rect.height - this.y;
        let overlapBottom = this.y + this.height - rect.y;
        let collisions = [];
        // Comparar las superposiciones para determinar la dirección de la colisión
        let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapLeft) {
            collisions.push('left') ;  // Colisión por la izquierda
        }
        if (minOverlap === overlapRight) {
            collisions.push('right'); // Colisión por la derecha
        }
        if (minOverlap === overlapTop) {
            collisions.push('top') ;   // Colisión por arriba
        }
        if (minOverlap === overlapBottom) {
            collisions.push('bottom'); // Colisión por abajo
        }
        return collisions
    }
    
    return null; // No hay colisión
};

// // Método para verificar colisiones generales
// Rect.prototype.intersec = function(rect) {
//     return (this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.height + this.y > rect.y) ? true : false;
// }

export {Rect}