import { keyboard } from "../../configs/keyboard.js";
import { controllsKey } from "../../configs/controllsKeys.js";

let controlls = {
    pushUp:false,
    dashQ:false,
    dashE:false,
    up:false,
    down:false,
    left:false,
    right:false,
    interact: false,
    inventoryOpen: false,
    inventoryPressed: false,
    lastInventoryPress: 0,
    inventoryDelay: 200,
    refresh:function(){
        if (keyboard.keyDown(controllsKey.up)||keyboard.keyDown(controllsKey.upSec)) {
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
        if (keyboard.keyDown(controllsKey.dashQ)) {
            controlls.dashQ = true;
        }
        if (keyboard.keyDown(controllsKey.dashE)) {
            controlls.dashE = true;
        }
        if (keyboard.keyDown(controllsKey.inventory) || keyboard.keyDown(controllsKey.esc)) {
            const currentTime = Date.now();
            if (!controlls.inventoryPressed && 
                currentTime - controlls.lastInventoryPress > controlls.inventoryDelay) {
                controlls.inventoryOpen = !controlls.inventoryOpen;
                controlls.lastInventoryPress = currentTime;
                controlls.inventoryPressed = true;
            }
        } else {
            controlls.inventoryPressed = false;
        }
        if (keyboard.keyDown(controllsKey.interact)) {
            controlls.interact = true
        }
    },
    restart:function(){
        controlls.up = false;
        controlls.right = false;
        controlls.down = false;
        controlls.left = false;
        controlls.dashE = false;
        controlls.dashQ = false;
        controlls.inventoryPressed = false;
        controlls.interact = false
    }
}

export{controlls}