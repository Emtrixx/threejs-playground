import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import Stats from 'three/examples/jsm/libs/stats.module'
import "./style.css";

//Scene
const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
var axesHelper = new THREE.AxesHelper(6)
scene.add(axesHelper)


//Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-3,3,3,-3,0,100)
// camera.lookAt(new THREE.Vector3(0,0,0))


//Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//Geometry
const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
scene.add(cube);

function Line() { 
  const points = [];
  points.push( new THREE.Vector3( - 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 10, 0 ) );
  points.push( new THREE.Vector3( 10, 0, 0 ) );
  
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

  const line = new THREE.Line( geometry, material );
  scene.add( line );
}
Line()
  


camera.position.z = 2;

//Controls
const controls = new OrbitControls(camera, renderer.domElement);

const stats = Stats()
document.body.appendChild(stats.domElement)

const gui = new dat.GUI()
const cubeFolder = gui.addFolder('Cube')
cubeFolder.open()
const cubeRotationFolder = cubeFolder.addFolder('Rotation')
cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01)
cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01)
cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01)

const cubePositionFolder = cubeFolder.addFolder('Position')
cubePositionFolder.add(cube.position, 'x', -6, 6, 0.01)
cubePositionFolder.add(cube.position, 'y', -6, 6, 0.01)
cubePositionFolder.add(cube.position, 'z', -6, 6, 0.01)

const cubeScaleFolder = cubeFolder.addFolder('Scale')
cubeScaleFolder.add(cube.scale, 'x', .1, 6, 0.01)
cubeScaleFolder.add(cube.scale, 'y', .1, 6, 0.01)
cubeScaleFolder.add(cube.scale, 'z', .1, 6, 0.01)

cubeFolder.add(cube, 'visible')

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10, 0.01)



//Animation
var animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.001;
  cube.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);

  stats.update()
};
animate();



//OWN
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height ;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
