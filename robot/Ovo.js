
class Ovo extends THREE.Object3D {

    constructor(parameters) {
        super();
        this.class = "OvoBu";
        this.mesh_ovo = null;
        this.ovos = new THREE.Object3D();
        this.velocity = 3;
        this.ovo = this.createOvo();
        this.add(this.ovo);
    }

    createOvo() {
        var random_pos_z = Math.floor((Math.random() * 500) + 1);
        var random_pos_x = Math.floor((Math.random() * 200) + 1);
        var random_class = Math.floor((Math.random() * 10) + 1);
        var random_shape = Math.floor((Math.random() * 10) + 1);
        var ovo = new THREE.Mesh();

        if (random_class > 2) {
            this.class = "OvoMa";
            var texture = new THREE.TextureLoader().load("imgs/2.png");
        } else {
            this.class = "OvoBu";
            var texture = new THREE.TextureLoader().load("imgs/1.png");
        }

        if (random_class > 2) {
            this.mesh_ovo = new THREE.Mesh(
                new THREE.SphereGeometry(15, 25, 25),
                new THREE.MeshPhongMaterial({ map: texture }));
        } else {
            this.mesh_ovo = new THREE.Mesh(
                new THREE.DodecahedronGeometry(15, 0),
                new THREE.MeshPhongMaterial({ map: texture }));
        }
        this.mesh_ovo.receiveShadow = true;
        this.mesh_ovo.castShadow = true;
        ovo.add(this.mesh_ovo);
        ovo.position.set(-400 + random_pos_x, 30, -250 + random_pos_z);
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

    iterate() {
        if (this.ovo.position.x < 750)
            this.ovo.position.x = this.ovo.position.x + this.velocity;

        this.ovo.rotation.y = (this.ovo.rotation.y + 0.09) % (Math.PI*2);
    }

    removeOvo() {
        this.remove(this.ovo);
    }

    getClass() {
        return this.class;
    }

    setVelocity(vel) { this.velocity = vel; }
}