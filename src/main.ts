import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";
import "./style.css";
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';

//Scene
// const scene: THREE.Scene = new THREE.Scene();
// scene.background = new THREE.Color(0x202020);
// var axesHelper = new THREE.AxesHelper(6);
// scene.add(axesHelper);

// //Camera
// const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// // const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-3,3,3,-3,0,100)
// // camera.lookAt(new THREE.Vector3(0,0,0))

// //Renderer
// const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

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
      "./images/skybox/skyboxMap/interstellar_bk.tga",
      "./images/skybox/skyboxMap/interstellar_up.tga",
      "./images/skybox/skyboxMap/interstellar_dn.tga",
      "./images/skybox/skyboxMap/interstellar_rt.tga",
      "./images/skybox/skyboxMap/interstellar_lf.tga",
    ]);
    this._scene.background = texture;
    this._scene.background = new THREE.Color(0x202020);

    //Geometry Plane
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

    this._RAF();
  }

  _OnWindowResize() {
    // Update sizes
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }
}

class BasicCharacterController {
  _input: BasicCharacterControllerInput;
  _stateMachine: FiniteStateMachine;
  constructor() {
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new FiniteStateMachine();
  }
}

class BasicCharacterControllerInput {
  _keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
  };
  constructor() {
    this._Init();
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
    };
    document.addEventListener("keydown", (e) => this._onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this._onKeyUp(e), false);
  }
  _onKeyDown(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._keys.forward = true;
        break;
      case "KeyA":
        this._keys.left = true;
        break;
      case "KeyS":
        this._keys.backward = true;
        break;
      case "KeyD":
        this._keys.right = true;
        break;
      case "Space":
        this._keys.space = true;
        break;
    }
  }
  _onKeyUp(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._keys.forward = false;
        break;
      case "KeyA":
        this._keys.left = false;
        break;
      case "KeyS":
        this._keys.backward = false;
        break;
      case "KeyD":
        this._keys.right = false;
        break;
      case "Space":
        this._keys.space = false;
        break;
    }
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

const player = new BasicCharacterController();
let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new WorldGen();
});
