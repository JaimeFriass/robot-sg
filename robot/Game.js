
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class Game extends THREE.Scene {

    constructor(renderer) {
        super();

        // Lights
        this.ambientLight = null;
        this.streetLight1 = null;
        this.streetLight2 = null;
        this.spotLightRobot = null;

        this.environment_loaded = false;
        this.third_camera = null;
        this.trackballControls = null;
        this.robot = null;
        this.ground = null;
        this.ovo = this.createOvo();
        this.ovos = new THREE.Object3D();
        this.add(this.ovos);
        this.ovo_velocity = 2;
        this.ovo_damage = 0.5;
        this.target = null;
        this.createLights();
        this.axis = new THREE.AxisHelper(25);
        this.add(this.axis);
        this.model = this.createModel();
        this.add(this.model);
        this.createCamera(renderer);

        // Ovos
        this.add(this.ovo);
        this.ovos_in_scene = 4;

        this.fog = new THREE.Fog(0x00000f, 150, 600);

        // Audio in scene
        var listener = new THREE.AudioListener();
        this.robot.getCamera().add(listener);
        
        var sound = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load('models/forest.ogg', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.7);
            sound.play();
        });
    }

    /// It creates the camera and adds it to the graph
    /**
     * @param renderer - The renderer associated with the camera
     */
    createCamera(renderer) {
        this.third_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.third_camera.position.set(60, 60, 60);
        var look = new THREE.Vector3(0, 40, 0);
        this.third_camera.lookAt(look);
        this.trackballControlsFP = new THREE.TrackballControls(this.third_camera, renderer);
        this.trackballControlsFP.rotateSpeed = 5;
        this.trackballControlsFP.zoomSpeed = -2;
        this.trackballControlsFP.panSpeed = 0.5;
        this.trackballControlsFP.minDistance = 40;
        this.trackballControlsFP.target = look;
        this.add(this.third_camera);
    }

    getPoints() { return this.robot.getPoints(); }
    getPos() { return this.robot.getPos(); }
    getRot() { return this.robot.getRot(); }
    getLookPoint() { return this.robot.getLookPoint(); }
    disableFirstCamera() { this.robot.disableCamera(); }

    /// It creates lights and adds them to the graph
    createLights() {
        // add subtle ambient lighting
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        this.add(this.ambientLight);

        // add spotlight for the shadows
        this.streetLight1 = new THREE.SpotLight(0xfbd63f);
        this.streetLight1.position.set(-335, 85, -285);
        this.streetLight1.castShadow = true;
        this.target = new THREE.Object3D(-335, 20, -285);
        this.streetLight1.target = this.target;
        this.streetLight1.target.position.set(-335, 20, -285);
        this.streetLight1.penumbra = 0.4;
        this.streetLight1.intensity = 1;
        // the shadow resolution
        this.streetLight1.shadow.mapSize.width = 2048
        this.streetLight1.shadow.mapSize.height = 2048;
        this.add(this.streetLight1);

        this.streetLight2 = new THREE.SpotLight(0xfbd63f);
        this.streetLight2.position.set(238, 85, 177);
        this.streetLight2.castShadow = true;
        this.target = new THREE.Object3D(238, 20, 177);
        this.streetLight2.target = this.target;
        this.streetLight2.target.position.set(238, 20, 177);
        this.streetLight2.penumbra = 0.4;
        this.streetLight2.intensity = 1;
        // the shadow resolution
        this.streetLight2.shadow.mapSize.width = 2048
        this.streetLight2.shadow.mapSize.height = 2048;
        this.add(this.streetLight2);

        this.background = new THREE.Color(0x00000f);
        this.add(this.target);
    }

    /// It creates the geometric model: robot and ground
    /**
     * @return The model
     */
    createModel() {
        var model = new THREE.Object3D();
        this.robot = new Robot({});
        model.add(this.robot);
        var loader = new THREE.TextureLoader();
        var textura = loader.load("imgs/wood.jpg");
        this.ground = new Ground(300, 300, new THREE.MeshPhongMaterial({ map: textura }), 4);

        model.add(this.ground);
        this.environment_loaded = true;
        return model;
    }

    // Public methods

    /// It sets the robot position according to the GUI
    /**
     * @controls - The GUI information
     */
    animate(controls) {
        this.axis.visible = controls.axis;
        this.streetLight1.intensity = controls.lightIntensity;
        this.robot.velocity = controls.velocity;
        //this.ovos_in_scene = controls.ovos_in_scene;
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
                this.robot.rotHeadLeft();
                break;
            case 90:
                this.robot.rotHeadRight();
                break;

        }

    }

    // OVOS MECHANICS

    createOvo() {
        var ovo = new THREE.Object3D();
        ovo = new Ovo({});
        return ovo;
    }

    updateOvos() {
        this.ovo.iterate();
        if (this.ovos.children.length < this.ovos_in_scene) {
            var new_ovo = this.createOvo();
            new_ovo.setVelocity(this.ovo_velocity);
            this.ovos.add(new_ovo);
        }
        for (var i = 0; i < this.ovos.children.length; i++) {
            this.ovos.children[i].iterate();
            if (this.ovos.children[i].getPos().x > 700) {
                this.ovos.children[i].removeOvo();
                this.ovos.remove(this.ovos.children[i]);
            }
        }
    }

    updateCollisions() {
        var returned = false;
        var points = 0;
        for (var i = 0; i < this.ovos.children.length; i++) {
            if (typeof this.ovos.children[i] != undefined) {
                if (this.robot.intersectOvo(this.ovos.children[i])) {
                    if (this.ovos.children[i].getClass() == 'OvoBu') {
                        if (this.robot.life < 97) {
                            points = Math.floor((Math.random() * 3));
                            this.robot.life += points;
                            this.robot.points += (5 - points);
                        }
                    } else {
                        this.robot.life -= this.ovo_damage;
                    }
                    returned = true;
                }
            }
        }
        return returned;
    }

    getLoadStatus() {
        return (this.ground.environment.children.length == 1);
    }

    getCamera(first_camera) {
        if (first_camera)
            return this.third_camera;
        else
            return this.robot.getCamera();
    }

    getCameraControls() {
        return this.trackballControlsFP;
    }   
    setCameraAspect(anAspectRatio) {
        this.third_camera.aspect = anAspectRatio;
        this.third_camera.updateProjectionMatrix();
        this.robot.setCameraAspect(anAspectRatio);
    }

    getRobotLife() { return this.robot.getLife(); }

    setDificulty(num) {
        switch (num) {
            case 1: // EASY
                this.ovos_in_scene = 3;
                this.ovo_velocity = 2;
                this.ovo_damage = 0.5;
                break;
            case 2: // MEDIUM
                this.ovos_in_scene = 4;
                this.ovo_velocity = 3;
                this.ovo_damage = 0.6;
                break;
            case 3: // HARD
                this.ovos_in_scene = 5;
                this.ovo_velocity = 5;
                this.ovo_damage = 0.8;
                this.robot.setVelocity(3);
                break;
        }
    }
}