import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";
import "./style.css";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import BasicCharacterControllerInput from "./CharacterController/BasicCharacterControllerInput";


// //Geometry
// const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
// const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true,
// });

// const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
// scene.add(cube);

// function Line() {
//   const points = [];
//   points.push(new THREE.Vector3(-10, 0, 0));
//   points.push(new THREE.Vector3(0, 10, 0));
//   points.push(new THREE.Vector3(10, 0, 0));

//   const geometry = new THREE.BufferGeometry().setFromPoints(points);
//   const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

//   const line = new THREE.Line(geometry, material);
//   scene.add(line);
// }
// Line();

// camera.position.z = 2;

// //Controls
// const controls = new OrbitControls(camera, renderer.domElement);

// const stats = Stats();
// document.body.appendChild(stats.domElement);

// const gui = new dat.GUI();
// const cubeFolder = gui.addFolder("Cube");
// cubeFolder.open();
// const cubeRotationFolder = cubeFolder.addFolder("Rotation");
// cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
// cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
// cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);

// const cubePositionFolder = cubeFolder.addFolder("Position");
// cubePositionFolder.add(cube.position, "x", -6, 6, 0.01);
// cubePositionFolder.add(cube.position, "y", -6, 6, 0.01);
// cubePositionFolder.add(cube.position, "z", -6, 6, 0.01);

// const cubeScaleFolder = cubeFolder.addFolder("Scale");
// cubeScaleFolder.add(cube.scale, "x", 0.1, 6, 0.01);
// cubeScaleFolder.add(cube.scale, "y", 0.1, 6, 0.01);
// cubeScaleFolder.add(cube.scale, "z", 0.1, 6, 0.01);

// cubeFolder.add(cube, "visible");

// const cameraFolder = gui.addFolder("Camera");
// cameraFolder.add(camera.position, "z", 0, 10, 0.01);

// //Animation
// var animate = function () {
//   requestAnimationFrame(animate);

//   cube.rotation.x += 0.001;
//   cube.rotation.y += 0.01;

//   controls.update();

//   renderer.render(scene, camera);

//   stats.update();
// };
// animate();

//OWN
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };
// window.addEventListener("resize", () => {});

// document.addEventListener("keydown", (e) => onKeyDown(e), false);
// document.addEventListener("keyup", (e) => onKeyUp(e), false);

// function onKeyDown(e: KeyboardEvent): any {
//   console.log(e.code);
//   switch (e.code) {
//     case "KeyW":
//       console.log("success");
//   }
// }
// function onKeyUp(e: KeyboardEvent): any {
//   switch (e.code) {
//     case "keyA":
//       console.log("asda");
//   }
// }

class WorldGen {
  _threejs: THREE.WebGLRenderer;
  _camera: THREE.PerspectiveCamera;
  _scene: THREE.Scene;
  _controls: BasicCharacterController;
  _previousRAF: any;

  constructor() {
    this._Initialize();
  }

  _Initialize() {
    //Renderer
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this._threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    //Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x202020);
    var axesHelper = new THREE.AxesHelper(6);
    this._scene.add(axesHelper);

    //Camera
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    //Light
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    let ambientLight = new THREE.AmbientLight(0x101010);
    this._scene.add(ambientLight);

    //Controls
    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    //Skybox
    // const tgaLoader = new TGALoader();
    // const ft = tgaLoader.load("./images/skybox/skyboxMap/interstellar_ft.tga")
    // const bk = tgaLoader.load("./images/skybox/skyboxMap/interstellar_bk.tga")
    // const up = tgaLoader.load("./images/skybox/skyboxMap/interstellar_up.tga")
    // const dn = tgaLoader.load("./images/skybox/skyboxMap/interstellar_dn.tga")
    // const rt = tgaLoader.load("./images/skybox/skyboxMap/interstellar_rt.tga")
    // const lt = tgaLoader.load("./images/skybox/skyboxMap/interstellar_lt.tga")

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./images/Meadow/posz.jpg",
      "./images/Meadow/negz.jpg",
      "./images/Meadow/posy.jpg",
      "./images/Meadow/negy.jpg",
      "./images/Meadow/negx.jpg",
      "./images/Meadow/posx.jpg",
    ]);
    this._scene.background = texture;
    // this._scene.background = new THREE.Color(0x202020);

    //Geometry
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._previousRAF = null;
    // this._LoadModel()
    this._LoadAnimatedModel()
    this._RAF();
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    }
    this._controls = new BasicCharacterController(params);
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }

  _OnWindowResize() {
    // Update sizes
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  // _LoadModel() {
  //   const loader = new GLTFLoader()
  //   loader.load('./models/Boxhead.gltf', gltf => {
  //     gltf.scene.traverse(c => {
  //       c.castShadow = true
  //     })
  //     this._scene.add(gltf.scene)
  //   })
  // }
}

class BasicCharacterController {

  _input: BasicCharacterControllerInput;
  _stateMachine: FiniteStateMachine;
  _decceleration: THREE.Vector3;
  _acceleration: THREE.Vector3;
  _velocity: THREE.Vector3;
  _params: any;
  _target: any;

  constructor(params) {
    this._params = params;
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new FiniteStateMachine();

    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    this._LoadModels();
  }

  _LoadModels() {
    const loader = new GLTFLoader()
    loader.load('./models/Boxhead.gltf', gltf => {
      gltf.scene.traverse(c => {
        c.castShadow = true
      })
      this._target = gltf;
      this._params.scene.add(this._target.scene);
    })
    // const loader = new FBXLoader();
    // loader.setPath('./resources/zombie/');
    // loader.load('mremireh_o_desbiens.fbx', (fbx) => {
    //   fbx.scale.setScalar(0.1);
    //   fbx.traverse(c => {
    //     c.castShadow = true;
    //   });

      

    //   this._mixer = new THREE.AnimationMixer(this._target);

    //   this._manager = new THREE.LoadingManager();
    //   this._manager.onLoad = () => {
    //     this._stateMachine.SetState('idle');
    //   };

    //   const _OnLoad = (animName, anim) => {
    //     const clip = anim.animations[0];
    //     const action = this._mixer.clipAction(clip);
  
    //     this._animations[animName] = {
    //       clip: clip,
    //       action: action,
    //     };
    //   };

    //   const loader = new FBXLoader(this._manager);
    //   loader.setPath('./resources/zombie/');
    //   loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
    //   loader.load('run.fbx', (a) => { _OnLoad('run', a); });
    //   loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
    //   loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
    // });
  }

  Update(timeInSeconds) {
    // this._stateMachine.Update(timeInSeconds, this._input);
    if (!this._target) {
      return;
    }

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.scene.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }

    // if (this._stateMachine._currentState.Name == 'dance') {
    //   acc.multiplyScalar(0.0);
    // }

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.scene.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.scene.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.scene.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.scene.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.scene.position.add(forward);
    controlObject.scene.position.add(sideways);

    oldPosition.copy(controlObject.scene.position);

    // if (this._mixer) {
    //   this._mixer.update(timeInSeconds);
    // }
  }
}

class FiniteStateMachine {
  _states: {};
  _currentState: any;
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new WorldGen();
});
