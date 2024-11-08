import { Game } from "../game/game.js";
import { states } from "./states.js";
import { Player } from "../game/ojects/player.js";
let p = new Player(1,1);
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
                    let game = new Game(p,'p');
                    console.log('state On')
                break;
            case states.GAME_PAUSE:
                break;
            case states.GAME_OFF:
                break;
        }
    },
    refresh:function(){
        stateMachine.stateAct.refresh()
    },
    draw: function(){
        stateMachine.stateAct.draw()
    }
}
export {stateMachine}