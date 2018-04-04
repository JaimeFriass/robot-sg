
/// Several functions, including the main

/// The scene graph
scene = null;


/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

/// Tecla a enviar
keypressed = null;
head_rotation = null;
ovo_pos = null;

inicio_ovo = null;
fin_ovo = null;

/// The current mode of the application

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    this.axis = true;
    this.lightIntensity = 0.5;
    //this.rotation = 5;
  }
  
  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Controles');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
    //axisLights.add(GUIcontrols, 'rotation', 0, 7, 0.1).name('Cabesa: ');

  if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {
  
  var stats = new Stats();
  
  stats.setMode(0); // 0: fps, 1: ms
  
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  
  $("#Stats-output").append( stats.domElement );
  
  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

function setLife(life) {
  //document.getElementById ("Life").innerHTML = "<h3>"+life+"</h3>";
  var progress = document.getElementById("progress");
  progress.innerHTML = life + ' %';
  progress.style.width = life + '%';
  if (life > 25 && life < 55) {
    progress.style.backgroundColor = "rgb(205, 248, 49)";
  }
  if (life < 25) {
    progress.style.backgroundColor = "rgb(248, 122, 49)"
  }

  if (life <= 0) {
    alert("Yo have lose");
    location.reload(); 
  }
  
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;
  } else {
  }
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
function onMouseMove (event) {

}

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
function onMouseUp (event) {
  if (mouseDown) {
    switch (applicationMode) {
      case Game.ADDING_BOXES :
        scene.addBox (event, Game.END_ACTION);
        break;
      case Game.MOVING_BOXES :
        scene.moveBox (event, Game.END_ACTION);
        break;
      default :
        applicationMode = Game.NO_ACTION;
        break;
    }
    mouseDown = false;
  }
}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;
  } else {  
    scene.getCameraControls().enabled = false;
    if (mouseDown) {
      switch (applicationMode) {
        case Game.MOVING_BOXES :
          scene.moveBox (event, Game.ROTATE_BOX);
          break;
      }
    }
  }
}

/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}


function onKeyDown(event) {
    
    var rotasion = 0;
    event = event || window.event;
    var keycode = event.keyCode;
    //console.log("onKeyDown " + keycode);
    switch (keycode) {
        case 37: // LEFT ARROW
            keypressed = 37;
            break;
        case 38: // UP ARROW
            keypressed = 38;
            break;
        case 39: // RIGHT ARROW
            keypressed = 39;
            break;
        case 40: // DOWN ARROW
            keypressed = 40;
            break;
        case 87: // W
            keypressed = 87;
            break;
        case 83: // S
            keypressed = 83;
            break;
        default:
            keypressed = keycode;
            //console.log("Tecla pulsada: " + keypressed);
            break;
    }
}

function onKeyUp(event) {
    //window.removeEventListener("keydown", onKeyDown, false);
    //console.log("onKeyUp");
    keypressed = null;
}

function randomPos(max) {
        return Math.floor((Math.random() * max) - max/2);

}
function draw_collitions(value) {
  if (value) {
    document.getElementById("life_bar").style.backgroundColor = 'red';
  } else {
    document.getElementById("life_bar").style.backgroundColor = 'gray';
  }
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  stats.update();

  scene.simulate();
  scene.getCameraControls().update ();
  scene.animate(GUIcontrols);

  if (keypressed != null) {
      scene.keycontrol(keypressed);
  }

  setLife(scene.getRobotLife());
  scene.loop(head_rotation);
  scene.ovo_movement(ovo_pos);
  draw_collitions(scene.updateCollisions());
  //position = scene.getPos();
  //rotation = scene.getRot();
  //console.log(scene.robot.rotation.y);

  //scene.camera.position.x = position.x ;
  //scene.camera.position.y = position.y + 40;
  //scene.camera.position.z = position.z;
  //scene.camera.rotation.y = rotation * Math.PI / 2;
  posicion = scene.getPos();
  scene.spotLightRobot.position.x = posicion.x;
  scene.spotLightRobot.position.z = posicion.z;
  
  scene.target.position.x = posicion.x;
  scene.target.position.z = posicion.z;
  scene.spotLightRobot.target = scene.target;

  TWEEN.update();
  
  
  renderer.render(scene, scene.getCamera());
}

function updateRan() {
    var ran = randomPos(200);
    inicio_ovo = { p: ran };
    fin_ovo = { p: -ran };
    console.log("MAX: " + ran);
}

/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);

  var position = { p: -1};
  var target = { p: 1 };

  var ran = randomPos(350);
  inicio_ovo = { p: 200 };
  fin_ovo = { p: -500 };



  // Movimiento de cabeza
  var head_movement = new TWEEN.Tween(position)
      .to(target, 1500)
    .easing(TWEEN.Easing.Bounce.In)
    .repeat(Infinity)
    .yoyo(true);

  // Movimiento de ovo1
  var ovo_movement1 = new TWEEN.Tween(inicio_ovo).easing(TWEEN.Easing.Quadratic.In)
        .to(fin_ovo, 6000).repeat(Infinity);

  var ovo_movement2 = new TWEEN.Tween(inicio_ovo).easing(TWEEN.Easing.Quadratic.In)
        .to(fin_ovo, 6000).chain(ovo_movement1);

  ovo_movement1.chain(ovo_movement2);

  head_movement.onUpdate(function () {
      head_rotation = position.p;
  });

  ovo_movement1.onUpdate(function () {
      updateRan();
      ovo_pos = inicio_ovo.p;
  });

  ovo_movement1.onUpdate(function () {
      ovo_pos = inicio_ovo.p;
  });

  head_movement.start();
  ovo_movement1.start();
  //ovo_movement2.start();
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener("mouseup", onMouseUp, true);

  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  
  'use strict';
  // Web worker that configures the threads
  Physijs.scripts.worker = '../libs/physijs_worker.js';

  // Physics motor
  Physijs.scripts.ammo = '../libs/ammo.js';

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new Game (renderer.domElement);
  
  scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

  createGUI(true);

  render();
});
