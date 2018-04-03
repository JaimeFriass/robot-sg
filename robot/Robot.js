
/// The Robot class
/**
 * @author JaimeFrais
 * 
 * @param parameters = {
 *      robotHeight: <float>,
 *      robotWidth : <float>,
 *      material: <Material>
 * }
 */

class Robot extends THREE.Object3D {
  
  constructor (parameters) {
    super();
    
    // If there are no parameters, the default values are used
    this.robotHeight = (parameters.robotHeight === undefined ? 30 : parameters.robotHeight);
    this.robotWidth  = (parameters.robotWidth === undefined ? 45 : parameters.robotWidth);
    var texturaa = new THREE.TextureLoader().load( "imgs/1.png" );
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({map: texturaa}) : parameters.material);
          
    // With these variables, the posititon of the hook is set
    this.rotHead = 0;
    this.rotBody = 0;

      // Ubication
    this.pos_x = 0;
    this.pos_z = 0;
    this.robot_rotation = 0;

    // Objects for operating with the robot
    this.head = null;
    this.body = null;
    this.mesh = null;
    this.left_leg = null;
    this.right_leg = null;

    // Life
    this.life = 100;

    // TEXTURAS
    this.tex_metal_blanco = new THREE.TextureLoader().load( "imgs/traje.jpg" );
  
    this.robot = this.createRobot();
    this.robot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(10, 100, 0));
    // A way of feedback, a red jail will be visible around the robot when a box is taken by it
    this.feedBack = new THREE.BoxHelper (this.robot, 0xFF0000);
    this.feedBack.visible = false;
    this.add (this.robot);
    this.add (this.feedBack);

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
    //this.mesh.translateOnAxis (new THREE.Vector3(0, 1, 0), -15);
    
    robot.add(this.mesh);
    robot.add(this.left_leg);
    robot.add(this.right_leg);
    robot.add(left_foot);
    robot.add(right_foot);

    robot.rotation.y = this.robot_rotation;

    robot.updateMatrix();
    return robot;
  }

  createFoot() {
    var texture = new THREE.TextureLoader().load( "imgs/black_metal.jpg" );
    var foot = new THREE.Mesh (
      new THREE.CylinderBufferGeometry( 2, 4, 2, 31 ),
      new THREE.MeshPhongMaterial ({map: texture}));
    foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 0, this.pos_z));
    foot.castShadow = true;
    return foot;
  }

  createLeg () {
    var texture = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var hoof = new THREE.Mesh (
      new THREE.CylinderBufferGeometry( 2, 2, 30, 31 ),
      new THREE.MeshPhongMaterial ({map: texture}));
    hoof.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 15, this.pos_z));
    hoof.castShadow = true;

    return hoof;
  }

  createHead() {
    var textura_cara = new THREE.TextureLoader().load( "imgs/fotito2.jpg" );
    var texture = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var skull = new THREE.Mesh (
      new THREE.SphereGeometry( 11, 32, 32),
      new THREE.MeshPhongMaterial ({map : texture}));
    skull.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 0, this.pos_z));
    skull.castShadow = true;

    var textura_ojo = new THREE.TextureLoader().load( "imgs/white_metal.jpg" );
    var eye = new THREE.Mesh (
      new THREE.CylinderBufferGeometry( 2, 2, 8, 30 ),
      new THREE.MeshPhongMaterial ({map: textura_ojo}));
    eye.geometry.applyMatrix (new THREE.Matrix4().makeRotationX (Math.PI / 2));
    eye.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 38, this.pos_z + 9));
    eye.castShadow = true;
    
    
    skull.add(eye);
    skull.updateMatrix();
      
    return skull;
  }

  createBody() {

    // CHEST
    var chest = new THREE.Mesh (
      new THREE.CylinderBufferGeometry( 11, 11, 28, 32 ),
      new THREE.MeshPhongMaterial ({map: this.tex_metal_blanco}));
    chest.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 20, this.pos_z));
    chest.castShadow = true;

    // SHOULDERS
    var shoulder_left = this.createShoulder();
    var shoulder_right = this.createShoulder();

    shoulder_left.geometry.applyMatrix (new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    shoulder_left.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (13, 28, 0));
    shoulder_right.geometry.applyMatrix (new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    shoulder_right.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-13, 28, 0));
    //shoulder_left.applyMatrix( new THREE.Matrix4().makeTranslation(-15, -28, 0) );
    //shoulder_left.rotation.z = Math.PI / 2;

    // HEAD
    this.head = this.createHead();
    this.head.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.pos_x, 35, this.pos_z));
    this.head.geometry.applyMatrix (new THREE.Matrix4().makeRotationY(Math.PI / 2));
     
    this.head.rotation.y = this.rotHead;
    
    chest.add(this.head);
    chest.add(shoulder_left);
    chest.add(shoulder_right);
    
    return chest;
  }

  createShoulder() {
    var texture = new THREE.TextureLoader().load( "imgs/black_metal.jpg" );
    var shoulder = new THREE.Mesh (
      new THREE.CylinderBufferGeometry( 3, 3, 8, 32 ),
      new THREE.MeshPhongMaterial ({map: texture}));
                                    
    shoulder.castShadow = true;
    //shoulder.rotation.z = Math.PI / 2;
    return shoulder;
  }

  looping(pos) {
      this.head.rotation.y = pos;
  }

  intersectOvo(ovo) {
    var ha_dado = false;
    var vectorBetweenOvo = new THREE.Vector2();
    vectorBetweenOvo.subVectors(new THREE.Vector2 (ovo.getPos().x, ovo.getPos().z),
                                new THREE.Vector2 (this.getPos().x, this.getPos().z));
    //console.log(vectorBetweenOvo.length() < 50);
    ha_dado = vectorBetweenOvo.length() < 20;
    return (ha_dado);
  }

  setRotHead(angulo) {
      this.rotHead = angulo;
      this.head.rotation.y = this.rotHead;
      if (this.feedBack.visible) {
          this.feedBack.update();
      }
  }

  setRotBody(angulo) {
    this.rotBody = angulo;
    this.body.rotation.x = this.rotBody;
    if (this.feedBack.visible) {
      this.feedBack.update();
    }
    
  }

  getPos() {
    var prueba = new THREE.Vector3();
    prueba.setFromMatrixPosition(this.robot.matrixWorld);
    return prueba;
  }

  getRot() {
    return this.robot.rotation.y;
  }

  getLife() { return this.life; }

  rotar(girar) {
      if (girar)
          this.rotHead = this.rotHead + 0.05;
      else
          this.rotHead = this.rotHead - 0.05;

      this.head.rotation.y = this.rotHead;
  }

  loopAnimation() {
      this.head.rotation.y = this.origen.p;
  }

  // ****************************************************************//
  //                CONTROLES DESDE TECLADO                          //
  // ****************************************************************//

  rotBodyForward() {
      if (this.rotBody < (Math.PI / 180)*20 ) {
        this.rotBody = this.rotBody + 0.04;
        this.mesh.rotation.x = this.rotBody;
      } else if (this.rotBody < (Math.PI /180)*30) {
        this.rotBody = this.rotBody + 0.01;
        this.mesh.rotation.x = this.rotBody;
      }
  }

  rotBodyBack() {
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
      this.robot_rotation = this.robot_rotation + 0.05;
      this.robot.rotation.y = this.robot_rotation;
  }

  turnRight() {
      this.robot_rotation = this.robot_rotation - 0.05;
      this.robot.rotation.y = this.robot_rotation;
  }

  walkForward() {
      this.pos_x = this.pos_x + 0.05;
      //this.robot.position.x = this.robot.position.x + 0.5;
      this.robot.translateZ(0.5);
  }

  walkBack() {
      this.pos_x = this.pos_x - 0.05;
      //this.robot.position.x = this.robot.position.x - 0.5;
      this.robot.translateZ(-0.5);
  }
  
}

// class variables
Robot.WORLD = 0;
Robot.LOCAL = 1;
