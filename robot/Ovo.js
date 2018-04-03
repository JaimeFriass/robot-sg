
class Ovo extends THREE.Object3D {

    constructor(parameters) {
        super();

        this.clase = null;

        this.ovo = this.createOvo();
        this.ovo2 = this.createOvoMod();

        this.feedBack = new THREE.BoxHelper (this.ovo2, 0xFF0000);
        this.feedBack.visible = true;
        
        this.add(this.ovo2);
        this.add(this.feedBack);
    }

    createOvo() {
        var texture = new THREE.TextureLoader().load("imgs/3.png");
        var ovo = new THREE.Mesh(
            new THREE.TorusBufferGeometry( 8, 4, 18, 100 ),
            new THREE.MeshPhongMaterial({ map: texture }));
        var random = Math.floor((Math.random() * 100) - 50);
        ovo.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(random, 25, 100));
        return ovo;
    }

    getPos() {
        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition(this.ovo2.matrixWorld);
        return pos;
    }

    move(pos_ovo) {
        this.ovo2.position.z = pos_ovo;
    }

    createOvoMod() {
        var avion = new THREE.Object3D();

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('models/');
        mtlLoader.setPath('models/');
        mtlLoader.load('avion.mtl', function (materials) {
      
            materials.preload();
      
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('models/');
            objLoader.load('avion.obj', function (object) {
      
                //scene.add(object);
                object.position.z = ovo_pos;
                object.position.y = 30;
                object.scale.y = 0.1;
                object.scale.x = 0.1;
                object.scale.z = 0.1;
                object.rotation.x = -Math.PI / 2;
                object.rotation.z = -Math.PI / 2;
                //object.position.y = 20;
                object.castShadow = true;
                
                avion.add(object);
      
            });
      
        });
        avion.add(new THREE.BoxHelper (avion, 0xFF0000));
        return avion;
    }
}