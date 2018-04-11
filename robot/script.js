
/// Several functions, including the main

/// The scene graph
scene = null;
renderer = null;

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

first_camera = null;
ticks = null;

/// The current mode of the application

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    this.axis = true;
    this.lightIntensity = 0.5;
    this.velocity = 1;
    this.ovos_in_scene = 4;
  }
  
  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Controles');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
  var robot = gui.addFolder ('Robot');
    robot.add(GUIcontrols, 'velocity', 0, 10, 1.0).name('Velocity :');
  var ovos = gui.addFolder ('Ovos');
    ovos.add(GUIcontrols, 'ovos_in_scene', 0, 20, 1.0).name('Number: ');

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
  
  progress.innerHTML = Math.round(life) + ' %';
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

function setPoints(pts) {
  var points_div = document.getElementById("points");
  points_div.innerHTML = pts;
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
        case 67: // C
            if (first_camera)
              first_camera = false;
            else
              first_camera = true;
        case 88: // Z
            keypressed = 90;
            break;
        case 90: // X
            keypressed = 88;
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

function updateTicks() {
  ticks++;
  document.getElementById("ticks").innerHTML = ticks;
  if (ticks < 1000) {
    // DIFICULTAD FACIL


  } else if (ticks < 5000) {
    // DIFICULTAD MEDIA
    document.getElementById("points").style.color = "orange";

  } else if (ticks < 10000) {
    // DIFICULTAD DIFICIL
    document.getElementById("points").style.color = "red";
  }
}

////////////////////////////////////////////////////////////////////
//////////////////// RENDER ////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function render() {
  updateTicks();
  requestAnimationFrame(render);
  stats.update();

  if (false) {
    scene.getCameraControls(true).update ();
  } else {
    scene.getCameraControls(false).update ();
  }

  scene.animate(GUIcontrols);

  if (keypressed != null) {
      scene.keycontrol(keypressed);
  }

  setLife(scene.getRobotLife());
  setPoints(scene.getPoints());
  draw_collitions(scene.updateCollisions());
 
  position = scene.getPos();
  posicion = scene.getPos();

  scene.iterateOvos();
  scene.updateOvos();

  TWEEN.update();
  renderer.render(scene, scene.getCamera(first_camera));
  scene.simulate();
}


/// The main function
$(function () {
  'use strict';
  // Web worker that configures the threads
  Physijs.scripts.worker = 'js/physijs_worker.js';
  // Physics motor
  Physijs.scripts.ammo = 'ammo.js';
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);

  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener("mouseup", onMouseUp, true);

  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  

  first_camera = true;
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new Game (renderer.domElement);
  
  scene.setGravity(new THREE.Vector3( 1, -50, 0 ));

  scene.addEventListener('update',
    function() {
      scene.simulate( undefined, 1 );
    }
  );		
  
  scene.addEventListener(
    'update',
    function() {
      scene.simulate( undefined, 2 );
    }
  );

  createGUI(true);

  render();
});
