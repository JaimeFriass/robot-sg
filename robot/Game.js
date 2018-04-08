
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class Game extends Physijs.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
    
    this.ambientLight = null;
    this.spotLight = null;
    this.spotLightRobot = null;
    this.camera = null;
    this.trackballControls = null;
    this.robot = null;
    this.ground = null;
    this.ovo = null;
    this.target = null;
  
    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add(this.model);

    this.ovos = this.createOvo();
    this.add(this.ovos);

    this.fixedTimeStep =  1 / 120;
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (60, 60, 60);	
    var look = new THREE.Vector3 (0,40,0);
    this.camera.lookAt(look);

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;
    
    this.add(this.camera);
  }

  getPos() { return this.robot.getPos(); }
  getRot() { return this.robot.getRot(); }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);
    
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);

    this.spotLightRobot = new THREE.SpotLight( 0xffffff);
    this.spotLightRobot.position.set(0,65, 0);
    this.spotLightRobot.castShadow = true;
    this.spotLightRobot.shadow.mapSize.width=512;
    this.spotLightRobot.shadow.mapSize.height=512;
    this.spotLightRobot.penumbra = 0.4;
    this.spotLightRobot.intensity = 0.5;
    this.target = new THREE.Object3D( 0, 30, 0 );
    this.add(this.target);
    //this.spotLightRobot.target = new THREE.Vector3(0, 30, 0);
    this.add(this.spotLightRobot);
  }
  
  /// It creates the geometric model: robot and ground
  /**
   * @return The model
   */
  createModel () {
    var model = new THREE.Object3D();
    this.robot = new Robot({});
    model.add (this.robot);
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");
    this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial ({map: textura}), 4);
    model.add (this.ground);
    return model;
  }

  createOvo() {
      var ovo = new THREE.Object3D();
      this.ovo = new Ovo({});
      ovo.add(this.ovo);
      return ovo;
  }
  
  // Public methods

  /// It sets the robot position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
      //this.robot.setRotHead(controls.rotation);
      this.axis.visible = controls.axis;
      this.spotLight.intensity = controls.lightIntensity;
  }

  loop(pos) {
      this.robot.looping(pos);
  }

  ovo_movement(pos_ovo) {
      this.ovo.move(pos_ovo);
  }

  keycontrol(controls) {
      switch (controls) {
          case 38:
              this.robot.walkForward();
              break;
          case 40:
              this.robot.walkBack();
              break;
          case 37:
              this.robot.turnLeft();
              break;
          case 39:
              this.robot.turnRight();
              break;
          
          case 97:
              this.robot.rotBodyForward();
              break;
          case 98:
              this.robot.rotBodyBack();
              break;
          
          case 102:
              this.robot.moveUp();
              break;
          case 99:
              this.robot.moveDown();
              break;
      }

  }

  updateCollisions() {
      var returned = false;
      if (this.robot.intersectOvo(this.ovo)) {
          this.robot.life -= 1;
          returned = true;
      }
      return returned;
  }

  getCamera () { return this.camera;}
  getCameraControls () { return this.trackballControls; }
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  getRobotLife() { return this.robot.getLife(); }
  
}

  // class variables
  
  // Application modes
  Game.NO_ACTION = 0;
  Game.ADDING_BOXES = 1;
  Game.MOVING_BOXES = 2;
  
  // Actions
  Game.NEW_BOX = 0;
  Game.MOVE_BOX = 1;
  Game.SELECT_BOX = 2;
  Game.ROTATE_BOX = 3;
  Game.END_ACTION = 10;


