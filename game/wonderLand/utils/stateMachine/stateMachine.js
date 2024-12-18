import { Game } from "../game/objects/game.js";
import { states } from "../configs/states.js";

let stateMachine = {
    stateAct: { instance: null, id: null },
    ini: function (e) {
        stateMachine.refreshState(e);
    },
    refreshState: function (newEvent) {
        switch (newEvent) {
            case states.CHARGE:
                stateMachine.stateAct = { instance: new ChargeState(), id: states.CHARGE };
                break;
            case states.MENU_INI:
                stateMachine.stateAct = { instance: new MenuState(), id: states.MENU_INI };
                break;
            case states.GAME_ON:
                stateMachine.stateAct = { instance: new Game(), id: states.GAME_ON };
                break;
            case states.GAME_PAUSE:
                stateMachine.stateAct = { instance: new PauseState(), id: states.GAME_PAUSE };
                break;
            case states.GAME_OFF:
                stateMachine.stateAct = { instance: null, id: states.GAME_OFF };
                break;
        }
    },
    refresh: function (regTemp) {
        if (stateMachine.stateAct.instance?.refresh) {
            stateMachine.stateAct.instance.refresh(regTemp);
        }
    },
    draw: function (regTemp) {
        if (stateMachine.stateAct.instance?.draw) {
            stateMachine.stateAct.instance.draw(regTemp);
        }
    }
};


export {stateMachine}