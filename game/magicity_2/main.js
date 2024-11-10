import { mainLoop } from "./utils/mainLoop.js";
import { size } from "./utils/tools/size.js";
import { keyboard } from "./utils/tools/keyboard.js";
import { stateMachine } from "./utils/tools/stateMachin/stateMachin.js";
import { states } from "./utils/tools/stateMachin/states.js";

let start={
    init: function(){
        console.log(`Game init!!`)
        keyboard.ini();
        size.initSize();
        mainLoop.iterator();
        stateMachine.ini(states.GAME_ON);
    }
}

start.init();
export {start} 