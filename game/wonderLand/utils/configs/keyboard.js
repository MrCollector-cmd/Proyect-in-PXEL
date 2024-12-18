var keyboard = {
    keys: new Array(),
    ini: function(){
        document.onkeydown = keyboard.saveKey;
        document.onkeyup = keyboard.deleteKey;
    },
    deleteKey:function(e){
        let pos = keyboard.keys.indexOf(e.key)
        if (pos !== -1) {
            keyboard.keys.splice(pos,1);
        }
    },
    saveKey: function(e){
        if (keyboard.keys.indexOf(e.key) == -1) {
            keyboard.keys.push(e.key);
        }
    },
    keyDown: function(codKey){
        return (keyboard.keys.indexOf(codKey) !== -1) ? true : false; 
    }
}
export {keyboard}