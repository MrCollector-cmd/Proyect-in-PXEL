import { size } from "./utils/configs/size.js";
import { keyboard } from "./utils/configs/keyboard.js";
import { stateMachine } from "./utils/stateMachine/stateMachine.js";
import { mainLoop } from "./utils/mainLoop.js/mainLoop.js";

let start={
    init: function(){
        console.log(`Game init!!`)
        size.initSize();
        keyboard.ini();
        mainLoop.iterator();
        stateMachine.ini(3);
        
    }
}

start.init();
export {start} 