
/// Several functions, including the main

/// The scene graph
scene = null;
renderer = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is pressed
mouseDown = false;

/// Key to send
keypressed = null;

// First camera active
first_camera = null;

// Pause menu active
active_menu = null;

// Current ticks
ticks = null;

// Environment loaded
environment_loaded = null;

/// The current mode of the application

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI(withStats) {
  GUIcontrols = new function () {
    this.axis = true;
    this.lightIntensity = 0.5;
    this.velocity = 2;
    //this.ovos_in_scene = 4;
  }

  var gui = new dat.GUI();
  var axisLights = gui.addFolder('Controles');
  axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
  axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
  var robot = gui.addFolder('Robot');
  robot.add(GUIcontrols, 'velocity', 0, 10, 1.0).name('Velocity :');
  //var ovos = gui.addFolder('Ovos');
  //vos.add(GUIcontrols, 'ovos_in_scene', 0, 20, 1.0).name('Number: ');

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
  $("#Stats-output").append(stats.domElement);
  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage(str) {
  document.getElementById("Messages").innerHTML = "<h2>" + str + "</h2>";
}

// LIFE
function setLife(life) {
  //document.getElementById ("Life").innerHTML = "<h3>"+life+"</h3>";
  var progress = document.getElementById("progress");
  progress.innerHTML = Math.round(life) + ' %';
  progress.style.width = life + '%';
  if (life > 55) {
    progress.style.backgroundColor = "rgb(135, 238, 83)";
  }
  if (life > 25 && life < 55) {
    progress.style.backgroundColor = "rgb(217, 238, 83)";
  }
  if (life < 25) {
    progress.style.backgroundColor = "rgb(248, 122, 49)";
  }

  if (life <= 0) {
    finishGame();
  }
}

// POINTS
function setPoints(pts) {
  var points_div = document.getElementById("points");
  points_div.innerHTML = pts;
}

// LOADING FUNCTIONS

function loading() {
  document.getElementById("loading").style.display = "block";
}

function stopLoading() {
  document.getElementById("loading").style.display = "none";
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown(event) {
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
function onMouseMove(event) {

}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel(event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;
  } else {
    scene.getCameraControls().enabled = false;
  }
}

/// It processes the window size changes
function onWindowResize() {
  scene.setCameraAspect(window.innerWidth / window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  event = event || window.event;
  var keycode = event.keyCode;
  //.log("onKeyDown " + keycode);
  switch (keycode) {
    case 37: // LEFT ARROW
      keypressed = 37; break;
    case 38: // UP ARROW
      keypressed = 38; break;
    case 39: // RIGHT ARROW
      keypressed = 39; break;
    case 40: // DOWN ARROW
      keypressed = 40; break;
    case 87: // W
      keypressed = 87; break;
    case 83: // S
      keypressed = 83; break;
    case 86: // V
      if (first_camera)
        first_camera = false;
      else
        first_camera = true;
    case 88: // Z
      keypressed = 90; break;
    case 90: // X
      keypressed = 88; break;

    case 32: // SPACE BAR
      if (!active_menu) {
        active_menu = true;
        document.getElementById("menu").style.display = "block";
      } else if (active_menu) {
        active_menu = false;
        document.getElementById("menu").style.display = "none";
      }
      break;
    default:
      keypressed = keycode;
      //console.log("Tecla pulsada: " + keypressed);
      break;
  }
}

function onKeyUp(event) {
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
function createRenderer() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;
}

function updateTicks() {
  ticks++;
  document.getElementById("ticks").innerHTML = ticks;
  if (ticks < 1000 && scene.getPoints() < 100) {
    // EASY
    document.getElementById("points").style.color = "green";
    document.getElementById("dificulty_div").style.color = "green";
    document.getElementById("dificulty_div").innerHTML = "Difficulty: EASY";
    scene.setDificulty(1);

  } else if (ticks < 7000 && scene.getPoints() < 500) {
    // MEDIUM
    document.getElementById("points").style.color = "orange";
    document.getElementById("dificulty_div").style.color = "orange";
    document.getElementById("dificulty_div").innerHTML = "Difficulty: MEDIUM";
    scene.setDificulty(2);
  } else {
    // HARD
    document.getElementById("points").style.color = "red";
    document.getElementById("dificulty_div").style.color = "red";
    document.getElementById("dificulty_div").innerHTML = "Difficulty: HARD";
    scene.setDificulty(3);
  }
}

function finishGame() {
  active_menu = true;
  document.getElementById("lose_menu").style.display = "block";
  document.getElementById("final_score").innerHTML = "Your score: " + scene.getPoints();
}

// When close button is pressed
function closeButton() {
  document.getElementById("menu").style.display = "none";
  active_menu = false;
}

function closeFinalMenu() {
  document.getElementById("lose_menu").style.display = "none";
  active_menu = false;
  ticks = 0;
  scene = new Game(renderer.domElement);
  environment_loaded = false;
}
////////////////////////////////////////////////////////////////////
//////////////////// RENDER ////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function render() {
  if (!environment_loaded) {
    if (!scene.getLoadStatus()) loading();
    else {
      environment_loaded = true; stopLoading();
    }
  }
  if (!active_menu) {
    stats.update();
    scene.getCameraControls().update();
    scene.animate(GUIcontrols);
    setLife(scene.getRobotLife());
    setPoints(scene.getPoints());
    draw_collitions(scene.updateCollisions());

    // Key Controls
    if (keypressed != null) {
      scene.keycontrol(keypressed);
    }

    posicion = scene.getPos();
    if (posicion.x > 460 || posicion.x < -455 ||
      posicion.z > 300 || posicion.z < -460)
      finishGame();

    updateTicks();
    scene.updateOvos();
  }
  requestAnimationFrame(render);
  renderer.render(scene, scene.getCamera(first_camera));
}

/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);

  // listeners
  window.addEventListener("resize", onWindowResize);
  //window.addEventListener("mousemove", onMouseMove, true);
  window.addEventListener("mousedown", onMouseDown, true);

  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
  window.addEventListener("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener("DOMMouseScroll", onMouseWheel, true); // For Firefox
  document.getElementById("cerrar").addEventListener("click", closeButton);
  document.getElementById("close_end_game").addEventListener("click", closeFinalMenu);

  first_camera = true;
  active_menu = false;
  environment_loaded = false;
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new Game(renderer.domElement);

  createGUI(true);

  render();
});
