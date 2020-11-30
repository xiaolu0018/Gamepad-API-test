
function isEmpty(num) {
  return num === undefined || num === null || isNaN(num);
}
let timer = null;
const haveEvents = 'GamepadEvent' in window;
const haveWebkitEvents = 'WebKitGamepadEvent' in window;
const rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;
const canRaf = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.cancelAnimationFrame;
let controllers = {};
let lastControllers = {};

function sendGamePad(gamepad){
  //other handle
}

function connecthandler(e) {
  addgamepad(e.gamepad);
  // newPadConnect
}

function disconnecthandler(e) {
  delete controllers[e.gamepad.index];
  if(!Object.keys(controllers).length){
    canRaf(timer)
  }

}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  rAF(updateStatus);
}

function updateStatus() {
  scangamepads();
  timer = rAF(updateStatus);
}

function scangamepads() {
  let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if(gamepads[i].index in controllers){
        controllers[gamepads[i].index] = gamepads[i];
        checkGamePadChange(gamepads[i].index)
        lastControllers[gamepads[i].index] =  gamepads[i];
      }else{
        delete controllers[gamepads[i].index];
        delete lastControllers[gamepads[i].index];
      }
    }
  }
}
function checkGamePadChange(j){
  let controller = controllers[j];
  let lastController = lastControllers[j];
  if(controller && lastControllers){
    let change = false;
    if(!lastController || !lastController.buttons || !lastController.axes){
      change = true;
    }else{
      for (let i=0; i<controller.buttons.length; i++) {
        let btn = controller.buttons[i] || {};
        let lBtn = lastController.buttons[i] || {};
        for(let item in btn){
          if(btn[item] !== lBtn[item]){
            change = true;
            break;
          }
        }
        if(change){
          break;
        }
      }
      if(!change){
        //axes
        change = (controller.axes || []).find((item,index) => item !== (lastController.axes || [])[index]);
      }
    }
    if(change){
      // changeState按键状态  j
      console.log('change gamepad btn state')
      sendGamePad(controller);
    }
  }
}

(function(peer){
  if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
  } else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
  } else {
    console.warn('gamepad api not suppeorted')
    // setInterval(scangamepads, 500);
    //不支持api事件情况，scangamepads要自己判断
  }
})()
