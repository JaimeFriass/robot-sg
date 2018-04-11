
class Ovo extends THREE.Object3D {

    constructor(parameters) {
        super();

        this.clase = "OvoBu";
        this.mesh_ovo = null;
        this.ovos = new THREE.Object3D();
        this.ovo = this.createOvo();
        //this.ovo2 = this.createOvoMod();

        this.add(this.ovo);
        
    }

    createOvo() {
        var random_pos_z = Math.floor((Math.random() * 500) + 1);
        var random_pos_x = Math.floor((Math.random() * 200) + 1);
        var random_class = Math.floor((Math.random() * 10) + 1);
        var ovo = new THREE.Mesh();
        //console.log("OVO: Creating ovo - x: "+random_pos_x);

        
        if (random_class > 2) {
            this.class = "OvoMa";
            var texture = new THREE.TextureLoader().load("imgs/2.png");
        } else {
            this.class = "OvoBu";
            var texture = new THREE.TextureLoader().load("imgs/3.png");
        }  

        this.mesh_ovo = new THREE.Mesh(
            new THREE.BoxBufferGeometry( 20, 20, 18 ),
            new THREE.MeshPhongMaterial({ map: texture }));
        this.mesh_ovo.receiveShadow = true;
        this.mesh_ovo.castShadow = true;
        ovo.add(this.mesh_ovo);
        ovo.position.set(-400 + random_pos_x, 30, -250 + random_pos_z);
        //ovo.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-400 + random_pos_x, 60, -300 + random_pos_z));
        return ovo;
        
    }

    getPos() {
        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition(this.ovo.matrixWorld);
        return pos;
    }

    move(pos_ovo) {
        this.ovo.position.z = pos_ovo;
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

    iterate() {  
        if (this.ovo.position.x < 750)
            this.ovo.position.x = this.ovo.position.x + 2;

        this.ovo.rotation.y = (this.ovo.rotation.y + 0.09) % 4;
    }

    removeOvo(){
        this.remove(this.ovo);
    }
}