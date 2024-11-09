var keyboard = {
    keys: new Array(),
    ini: function(){
        document.onkeydown = keyboard.saveKey;
    },
    saveKey: function(e){
        keyboard.keys.push(e.key);
    },
    keyDown: function(codKey){
        return (keyboard.keys.indexOf(codKey) !== -1) ? true : false; 
    },
    restart: function(){
        keyboard.keys = new Array();
    }
}
export {keyboard}