import { mainLoop } from "./utils/mainLoop.js";
import { size } from "./utils/tools/size.js";
import { keyboard } from "./utils/tools/keyboard.js";
import { stateMachine } from "./utils/tools/stateMachin/stateMachin.js";

let start={
    init: function(){
        console.log(`Game init!!`)
        keyboard.ini();
        size.initSize();
        mainLoop.iterator();
        stateMachine.ini(3);
    }
}

start.init();
export {start} 