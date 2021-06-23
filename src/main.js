import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import Stats from 'three/examples/jsm/libs/stats.module';
import "./style.css";
//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-3,3,3,-3,0,100)
// camera.lookAt(new THREE.Vector3(0,0,0))
//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//Geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 2;
//Controls
const controls = new OrbitControls(camera, renderer.domElement);
const stats = Stats();
document.body.appendChild(stats.domElement);
const gui = new dat.GUI();
gui.add(cube.rotation, 'x', 0, Math.PI);
//Animation
var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
    stats.update();
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
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
