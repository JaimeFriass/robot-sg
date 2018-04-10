
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
    this.third_camera = null;
    this.trackballControlsFP = null;
    this.trackballControls = null;
    this.robot = null;
    this.ground = null;
    this.ovo = null;
    this.ovos = new THREE.Object3D();
    this.add(this.ovos);
    this.target = null;
  
    this.createLights ();
    
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add(this.model);
    this.createCamera (renderer);

    //this.ovos = this.createOvo();
    //this.add(this.ovos);

    this.fog = new THREE.Fog(0xfffff3, 100, 600);

    this.fixedTimeStep =  1 / 120;
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.third_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.third_camera.position.set (60, 60, 60);	
    var look = new THREE.Vector3 (0,40,0);
    this.third_camera.lookAt(look);
    this.trackballControlsFP = new THREE.TrackballControls (this.third_camera, renderer);
    this.trackballControlsFP.rotateSpeed = 5;
    this.trackballControlsFP.zoomSpeed = -2;
    this.trackballControlsFP.panSpeed = 0.5;
    this.trackballControlsFP.minDistance = 40;
    this.trackballControlsFP.target = look;
    
    this.add(this.third_camera);
  }

  getPos() { return this.robot.getPos(); }
  getRot() { return this.robot.getRot(); }
  getLookPoint() { return this.robot.getLookPoint();}
  disableFirstCamera() { this.robot.disableCamera(); }
  iterateOvos() { /*this.ovos.iterate();*/}
  
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
      ovo = new Ovo({});
      return ovo;
  }

  updateOvos() {
      
      for (var i = 0; i < this.ovos.children.length; i++) {
          if (this.ovos.children[i].getPos().x == 400) {
              this.remove(this.ovos.children[i]);
          }
          this.ovos.children[i].iterate();
      }
      if (this.ovos.children.length < 4) {
          var texture = new THREE.TextureLoader().load("imgs/3.png");
          var new_ovo = this.createOvo();
          this.ovos.add(new_ovo);
      }
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

          case 88:
              this.robot.rotHeadRight();
              break;
          case 90:
              this.robot.rotHeadLeft();
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

  getCamera (first_camera) { 
    if (first_camera)  
        return this.third_camera;
    else
      return this.robot.getCamera();
    }

  getCameraControls (first_camera) { 
    if (first_camera) 
     return this.trackballControlsFP;
    else 
     //return this.robot.getCameraControls();
     return this.trackballControlsFP;
    }
  setCameraAspect (anAspectRatio) {
    this.third_camera.aspect = anAspectRatio;
    this.third_camera.updateProjectionMatrix();
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


