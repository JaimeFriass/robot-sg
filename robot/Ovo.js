
class Ovo extends THREE.Object3D {

    constructor(parameters) {
        super();

        this.clase = null;

        this.ovo = this.createOvo();
        //this.ovo2 = this.createOvoMod();

        //this.feedBack = new THREE.BoxHelper (this.ovo2, 0xFF0000);
        //this.feedBack.visible = true;
        //this.add(this.feedBack);

        this.add(this.ovo);
        
    }

    createOvo() {
        var random_pos_x = Math.floor((Math.random() * 600) + 1);

        console.log("OVO: Creating ovo - x: "+random_pos_x);

        var texture = new THREE.TextureLoader().load("imgs/3.png");
        var ovo_material = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({ map: texture }),
            .6,
            .3
        );

        var ovo1 = new Physijs.BoxMesh(
            new THREE.BoxGeometry(30, 30, 30),
            ovo_material,
            3
        );

        /*
        var ovo = new THREE.Mesh(
            new THREE.TorusBufferGeometry( 8, 4, 18, 100 ),
            new THREE.MeshPhongMaterial({ map: texture }));
        */
       ovo1.receiveShadow = true;
       ovo1.castShadow = true;

        ovo1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(30, 30, -300 + random_pos_x));
        return ovo1;
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
        if (this.ovo.position.x < 400)
            this.ovo.position.x = this.ovo.position.x + 2;

    }

    getPos() {
        return this.ovo.position;
    }
}