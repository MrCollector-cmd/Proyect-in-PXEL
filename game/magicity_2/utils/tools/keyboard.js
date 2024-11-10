var keyboard = {
    keys: new Array(),
    ini: function(){
        document.addEventListener('keydown', keyboard.saveKey);
        document.addEventListener('keyup', keyboard.removeKey);
        console.log('Keyboard initialized');
    },
    saveKey: function(e){
        if (keyboard.keys.indexOf(e.key) === -1) {
            keyboard.keys.push(e.key);
            console.log('Key pressed:', e.key);
        }
    },
    removeKey: function(e){
        const index = keyboard.keys.indexOf(e.key);
        if (index !== -1) {
            keyboard.keys.splice(index, 1);
        }
    },
    keyDown: function(codKey){
        return keyboard.keys.indexOf(codKey) !== -1;
    },
    restart: function(){
        keyboard.keys = new Array();
    }
}
export {keyboard}