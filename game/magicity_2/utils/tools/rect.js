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
    var html = document.getElementById("game").innerHTML;
    var color = `#${Math.floor(Math.random()*16777215).toString(16)}`
    document.getElementById('game').innerHTML = html + div;
    document.getElementById(this.id).style.position = 'absolute';   
    document.getElementById(this.id).style.left = `${this.x}px`;   
    document.getElementById(this.id).style.top = `${this.y}px`; 
    document.getElementById(this.id).style.width = `${this.width}px`;
    document.getElementById(this.id).style.height = `${this.height}px`;  
    document.getElementById(this.id).style.backgroundColor = `${color}`;
    return this.id
};

export {Rect}