import { Game } from "../game/game.js";
import { states } from "./states.js";
import { Player } from "../game/ojects/player.js";
let p = new Player(2,2);
let stateMachine = {
    stateAct: null,
    ini: function(e){
        stateMachine.refreshState(e)
    },
    refreshState:function(newEvent){
        switch(newEvent){
            case states.CHARGE:
                break;
            case states.MENU_INI:
                break;
            case states.MENU_SUB:
                break;
            case states.GAME_ON:
                    let game = new Game(p);
                break;
            case states.GAME_PAUSE:
                break;
            case states.GAME_OFF:
                break;
        }
    },
    refresh:function(regTemp){ 
        stateMachine.stateAct.refresh(regTemp)
    },
    draw: function(){
        stateMachine.stateAct.draw()
    }
}
export {stateMachine}