import { Game } from "../game/game.js";
import { states } from "./states.js";
import { Player } from "../game/ojects/player.js";
let p = new Player(2,2);
let stateMachine = {
    stateAct: [],
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
                    stateMachine.stateAct = [new Game(p),3];
                break;
            case states.GAME_PAUSE:
                break;
            case states.GAME_OFF:
                break;
        }
    },
    refresh:function(regTemp){ 
        if(stateMachine.stateAct[1] === 3){
         p.move()
    
        }
    },
    draw: function(){
        stateMachine.stateAct.draw()
    }
}
export {stateMachine}