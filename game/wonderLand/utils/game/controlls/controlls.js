import { keyboard } from "../../configs/keyboard.js";
import { controllsKey } from "../../configs/controllsKeys.js";

let controlls = {
    pushUp:false,
    dash:false,
    up:false,
    down:false,
    left:false,
    right:false,
    refresh:function(){
        if (keyboard.keyDown(controllsKey.up)) {
            controlls.up = true;
        }
        if (keyboard.keyDown(controllsKey.down)) {
            controlls.down = true;
        }
        if (keyboard.keyDown(controllsKey.left)) {
            controlls.left = true;
        }
        if (keyboard.keyDown(controllsKey.right)) {
            controlls.right = true;
        }
        if (keyboard.keyDown(controllsKey.dash)) {
            controlls.dash = true;
        }
    },
    restart:function(){
        controlls.up = false;
        controlls.right = false;
        controlls.down = false;
        controlls.left = false;
        controlls.dash = false;
    }
}

export{controlls}