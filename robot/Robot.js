
/// The Robot class
/**
 * @author JaimeFrias
 */

class Robot extends THREE.Object3D {
  
  constructor (parameters) {
    super();
    
    // If there are no parameters, the default values are used
    this.robotHeight = (parameters.robotHeight === undefined ? 30 : parameters.robotHeight);
    this.robotWidth  = (parameters.robotWidth === undefined ? 45 : parameters.robotWidth);
    var texturaa = new THREE.TextureLoader().load( "imgs/1.png" );
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({map: texturaa}) : parameters.material);
    
    // Initial Ubication
    this.pos_x = 0;
    this.pos_z = 0;
    this.robot_rotation = 0;

    // Objects for operating with the robot
    this.head = null;
    this.body = null;
    this.mesh = null;
    this.left_leg = null;
    this.right_leg = null;
    this.look_point = null;

    // Light of the robot
    this.spotLightHead = null;

    // First camera
    this.viewpoint = null;
    this.eye_camera = null;
    this.trackballControls = null;

    // Life
    this.life = 100;

    // Points
    this.points = 0;

    // Robot Velocity
    this.velocity = 1.5;

    // TEXTURES
    this.tex_metal_blanco = new THREE.TextureLoader().load( "imgs/traje.jpg" );
  
    this.robot = this.createRobot();
    this.robot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(10, 100, 0));

    this.add (this.robot);
  }
  
  // Private methods

  createRobot() {
    var robot = new THREE.Mesh();

    this.body = this.createBody();
    this.left_leg = this.createLeg();
    var left_foot = this.createFoot();
    this.right_leg = this.createLeg();
    var right_foot = this.createFoot();

    this.left_leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (14, 0, 0));
    this.right_leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-14, 0, 0));
    
    left_foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (14, 0, 0));
    right_foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-14, 0, 0));
    
    this.body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 29, 0));
    this.body.geometry.applyMatrix (new THREE.Matrix4().makeRotationX (0));
    this.body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -29, 0));
    
    // Trasladamos el cuerpo al eje para poder rotarse
    this.body.position.y = -28;

    // Creamos un Object3D para trasladarlo de vuelta a su posicion inicial
    this.mesh = new THREE.Object3D();
    this.mesh.add(this.body);
    this.mesh.position.y = 28;

    robot.add(this.mesh);
    robot.add(this.left_leg);
    robot.add(this.right_leg);
    robot.add(left_foot);
    robot.add(right_foot);
    robot.position.y = 4;
    robot.updateMatrix();
    return robot;
  }

  createFoot() {
    var texture = new THREE.TextureLoader().load( "imgs/black_metal.jpg" );
    var foot = new THREE.Mesh (
      new THREE.CylinderGeometry( 2, 4, 2, 31 ),
      new THREE.MeshPhongMaterial ({map: texture})
    )
    foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 0, this.pos_z));
    foot.castShadow = true;
    return foot;
  }

  createLeg () {
    var texture = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var hoof = new THREE.Mesh (
      new THREE.CylinderGeometry( 2, 2, 30, 31 ),
      new THREE.MeshPhongMaterial ({map: texture})
    )
    hoof.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 15, this.pos_z));
    hoof.castShadow = true;

    return hoof;
  }

  createHead() {
    var texture = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var skull = new THREE.Mesh ( 
      new THREE.SphereGeometry( 11, 32, 32),
      new THREE.MeshPhongMaterial ({map: texture})
    )
    skull.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 0, this.pos_z));
    skull.castShadow = true;

    var eye_texture = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var eye = new THREE.Mesh(
      new THREE.CylinderGeometry( 2, 2, 8, 30 ),
      new THREE.MeshPhongMaterial ({map: eye_texture})
    )
    eye.geometry.applyMatrix (new THREE.Matrix4().makeRotationX (Math.PI / 2));
    eye.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 38, this.pos_z + 9));
    eye.castShadow = true;
    // EYE CAMERA
    this.viewpoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50), 0)
    this.viewpoint.position.set(0, -4, 50);
    this.eye_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.eye_camera.lookAt(this.viewpoint.position);
    this.eye_camera.position.set(0, 40, 9);

    // EYE SPOTLIGHT
    this.spotLightHead = new THREE.SpotLight( 0xffffff);
    this.spotLightHead.position.set(0,43, 15);
    this.spotLightHead.castShadow = true;
    this.spotLightHead.target = this.viewpoint;
    this.spotLightHead.penumbra = 0.4;
    this.spotLightHead.intensity = 0.5;

    skull.add(this.spotLightHead);
    skull.add(this.eye_camera);
    skull.add(this.viewpoint);
    
    skull.add(eye);
    skull.updateMatrix();
      
    return skull;
  }

  createBody() {
    // CHEST
    var chest = new THREE.Mesh (
      new THREE.CylinderGeometry( 11, 11, 28, 32 ),
      new THREE.MeshPhongMaterial ({map: this.tex_metal_blanco})
    )

    chest.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 20, this.pos_z));
    chest.castShadow = true;

    // SHOULDERS
    var shoulder_left = this.createShoulder();
    var shoulder_right = this.createShoulder();
    shoulder_left.geometry.applyMatrix (new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    shoulder_left.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (13, 28, 0));
    shoulder_right.geometry.applyMatrix (new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    shoulder_right.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-13, 28, 0));

    // HEAD
    this.head = this.createHead();
    this.head.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 35, this.pos_z));
    this.head.geometry.applyMatrix (new THREE.Matrix4().makeRotationY(Math.PI / 2));
    chest.add(this.head);
    chest.add(shoulder_left);
    chest.add(shoulder_right);
    return chest;
  }

  createShoulder() {
    var texture = new THREE.TextureLoader().load( "imgs/black_metal.jpg" );
    var shoulder = new THREE.Mesh (
      new THREE.CylinderGeometry( 3, 3, 8, 32 ),
      new THREE.MeshPhongMaterial ({map: texture})
    )                        
    shoulder.castShadow = true;
    return shoulder;
  }

  intersectOvo(ovo) {
    var ha_dado = false;
    var vectorBetweenOvo = new THREE.Vector2();
    vectorBetweenOvo.subVectors(new THREE.Vector2 (ovo.getPos().x, ovo.getPos().z),
                                new THREE.Vector2 (this.getPos().x, this.getPos().z));
    ha_dado = vectorBetweenOvo.length() < 27;
    return (ha_dado);
  }

  //                          GETTERS / SETTERS
  // ****************************************************************//
  setRotHead(g) {
      this.head.rotation.y = g;
  }

  setRotBody(g) {
    this.body.rotation.x = g;
  }
  getPos() {
    var prueba = new THREE.Vector3();
    prueba.setFromMatrixPosition(this.robot.matrixWorld);
    return prueba;
  }

  getLookPoint() {
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(this.look_point.matrixWorld);
    return vector;
  }

  getRot() {return this.robot.rotation.y;}
  getPoints() {return this.points;}
  getLife() { return this.life; }
  getCamera() { return this.eye_camera;}
  getCameraControls () { return this.trackballControls; }
  setVelocity(vel) { this.velocity = vel; }

  setCameraAspect (anAspectRatio) {
    this.eye_camera.aspect = anAspectRatio;
    this.eye_camera.updateProjectionMatrix();
  }


  // ****************************************************************//
  //                KEYBOARD CONTROLS                                //
  // ****************************************************************//
  rotHeadLeft() {
    // 80º limit
    if (this.head.rotation.y < (Math.PI / 180)*80) {
      this.head.rotation.y = this.head.rotation.y + 0.03;
    }
  }

  rotHeadRight() {
    if (this.head.rotation.y > -(Math.PI / 180)*80) {
      this.head.rotation.y = this.head.rotation.y - 0.03;
    }
  }

  rotBodyForward() {
      // 30º limit
      if (this.rotBody < (Math.PI / 180)*20 ) {
        this.rotBody = this.rotBody + 0.04;
        this.mesh.rotation.x = this.rotBody;
      } else if (this.rotBody < (Math.PI /180)*30) {
        this.rotBody = this.rotBody + 0.01;
        this.mesh.rotation.x = this.rotBody;
      }
  }

  rotBodyBack() {
      // 45º limit
      if (this.rotBody >  -( Math.PI / 180 )*30) {
        this.rotBody = this.rotBody - 0.04;
        this.mesh.rotation.x = this.rotBody;
      } else if (this.rotBody > -(Math.PI / 180)*45) {
        this.rotBody = this.rotBody - 0.01;
        this.mesh.rotation.x = this.rotBody;
      }
  }

  moveUp() {
    if (this.mesh.position.y < 40) {
      this.right_leg.scale.y = this.right_leg.scale.y + 0.01;
      this.left_leg.scale.y = this.left_leg.scale.y + 0.01;
      this.mesh.position.y = this.mesh.position.y + 0.3;
    }
  }

  moveDown() {
    if (this.mesh.position.y > 24) {
      this.right_leg.scale.y = this.right_leg.scale.y - 0.01;
      this.left_leg.scale.y = this.left_leg.scale.y - 0.01;
      this.mesh.position.y = this.mesh.position.y - 0.3;
    }
  }

  turnLeft() {
      this.robot_rotation = this.robot_rotation + 0.03;
      this.robot.rotation.y = this.robot_rotation;
  }

  turnRight() {
      this.robot_rotation = this.robot_rotation - 0.03;
      this.robot.rotation.y = this.robot_rotation;
  }

  walkForward() {
      this.life -= 0.1;
      this.robot.translateZ(this.velocity);
  }

  walkBack() {
      this.life -= 0.1;
      this.robot.translateZ(-this.velocity);
  }
  
}
