
/// The Ground class
/**
 * @author JaimeFrias
 */

class Ground extends THREE.Object3D {

  constructor () {
    
    super();
    this.loaded = false;
    this.ground = null;
    var texture = new THREE.TextureLoader().load( "imgs/pavement.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);

    this.ground = new THREE.Mesh (
      new THREE.BoxGeometry (1000, 0.1, 1000, 1, 1, 1),
      new THREE.MeshPhongMaterial ({map: texture})
    )

    this.environment = this.createHouses();
    this.loaded = true;
    this.add(this.environment);
    this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
    this.ground.receiveShadow = true;
    this.ground.autoUpdateMatrix = false;
    this.add (this.ground);
  }

  createHouses() {
      var houses = new THREE.Object3D();
      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.setPath('models/');
      mtlLoader.load('environment.mtl', function (materials) {
    
          materials.preload();
          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath('models/');
          objLoader.load('environment.obj', 
          
          function (object) {
              object.position.y = -0.5;
              object.scale.y = 4.7;
              object.scale.x = 4.7;
              object.scale.z = 4.7;
              object.rotation.x = -Math.PI / 2;
              object.castShadow = true;

              houses.add(object);
    
          });
    
      });
      return houses;
  }
}
