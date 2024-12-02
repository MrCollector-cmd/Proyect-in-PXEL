import { Game } from "../game/objects/game.js";
import { states } from "../configs/states.js";
// import { Player } from "../game/ojects/player.js";
// let p = new Player(2,2);
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
                    stateMachine.stateAct = [new Game(),3];
                break;
            case states.GAME_PAUSE:
                break;
            case states.GAME_OFF:
                break;
        }
    },
    refresh:function(regTemp){ 
        if(stateMachine.stateAct[1] === 3){
            stateMachine.stateAct[0].start();
        }
    },
    draw: function(regTemp){
    }
}
export {stateMachine}