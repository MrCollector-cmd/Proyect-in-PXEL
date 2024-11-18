import { mainLoop } from "./utils/mainLoop.js";
import { size } from "./utils/tools/size.js";
import { keyboard } from "./utils/tools/keyboard.js";
import { stateMachine } from "./utils/tools/stateMachin/stateMachin.js";
import { controlls } from "./utils/tools/game/interacts/controlls.js";

let start={
    init: function(){
        console.log(`Game init!!`)
        size.initSize();
        keyboard.ini();
        // controlls.refresh()
        mainLoop.iterator();
        stateMachine.ini(3);
        
    }
}

start.init();
export {start} 