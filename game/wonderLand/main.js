import { size } from "./utils/configs/size.js";
import { keyboard } from "./utils/configs/keyboard.js";
import { stateMachine } from "./utils/stateMachine/stateMachine.js";
import { mainLoop } from "./utils/mainLoop.js/mainLoop.js";
const start = {
	iniciator: [
		console.log(`Game init!!`),
        size.initSize(),
        keyboard.ini(),
        mainLoop.iterator(),
        stateMachine.ini(3)
	],
	iniGame: function() {
		start.chainOfInit(start.iniciator.shift());
	},
	chainOfInit: function(iniciator) {
		if(iniciator) {
			iniciator(() => start.encadenarInicios(iniciator.shift()));
		}
	}
};

document.addEventListener('DOMContentLoaded', function() {
	start.iniGame();
}, false);

export {start} 