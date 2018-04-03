
/// The Ground class
/**
 * @author FVelasco
 * 
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Ground extends THREE.Object3D {

  constructor () {
    super();
    this.ground = null;
    //this.raycaster = new THREE.Raycaster ();  // To select boxes
  

    var texture = new THREE.TextureLoader().load( "imgs/pavement.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
    this.ground = new THREE.Mesh (
      new THREE.BoxGeometry (1000, 0.1, 1000, 1, 1, 1),
      //new THREE.MeshPhongMaterial ({color: 0x153249, specular: 0xfbf804, shininess: 70}));
      new THREE.MeshPhongMaterial ({map: texture}));
    this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
    this.ground.receiveShadow = true;
    this.ground.autoUpdateMatrix = false;
    this.add (this.ground);

    /*
    this.obs1 = this.createObstacles(-120, 75, -150);
    this.obs2 = this.createObstacles(-10, 50, -200);
    this.obs3 = this.createObstacles(140, 75, -160);
    this.obs4 = this.createObstacles(-280, 75, -50);
    this.add(this.obs1);
    this.add(this.obs2);
    this.add(this.obs3);
    this.add(this.obs4);
    */

    this.environment = this.createHouses();
    this.add(this.environment);
  }

  createObstacles(posx, posy, posz) {
    var texture = new THREE.TextureLoader().load("imgs/fachada.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 3 );
    var obs = new THREE.Mesh(
      new THREE.BoxGeometry( 100, 150, 80 ),
        new THREE.MeshPhongMaterial({ map: texture }));
    obs.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(posx, posy, posz));
    return obs;
  }

  createHouses() {

      var houses = new THREE.Object3D();

      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.setTexturePath('models/');
      mtlLoader.setPath('models/');
      mtlLoader.load('environment.mtl', function (materials) {
    
          materials.preload();
    
          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath('models/');
          objLoader.load('environment.obj', function (object) {
    
              //scene.add(object);
              object.position.y = -2;
              object.scale.y = 4;
              object.scale.x = 4;
              object.scale.z = 4;
              object.rotation.x = -Math.PI / 2;
              //object.rotation.z = -Math.PI / 2;
              //object.position.y = 20;
              object.castShadow = true;
    
              houses.add(object);
    
          });
    
      });
      return houses;
  }
  
  
  /// It returns the position of the mouse in normalized coordinates ([-1,1],[-1,1])
  /**
   * @param event - Mouse information
   * @return A Vector2 with the normalized mouse position
   */
  getMouse (event) {
    var mouse = new THREE.Vector2 ();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
    return mouse;
  }
  
  /// It returns the point on the ground where the mouse has clicked
  /**
   * @param event - The mouse information
   * @return The Vector2 with the ground point clicked, or null
   */
  getPointOnGround (event) {
    var mouse = this.getMouse (event);
    this.raycaster.setFromCamera (mouse, scene.getCamera());
    var surfaces = [this.ground];
    var pickedObjects = this.raycaster.intersectObjects (surfaces);
    if (pickedObjects.length > 0) {
      return new THREE.Vector2 (pickedObjects[0].point.x, pickedObjects[0].point.z);
    } else
      return null;
  }
}
