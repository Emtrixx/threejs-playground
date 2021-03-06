import * as THREE from "three";
import BasicCharacterControllerInput from "./BasicCharacterControllerInput";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";


export default class BasicCharacterController {

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
      // const loader = new GLTFLoader()
      // loader.load('./models/Boxhead.gltf', gltf => {
      //   gltf.scene.traverse(c => {
      //     c.castShadow = true
      //   })
      //   this._target = gltf;
      //   this._params.scene.add(this._target.scene);
      // })
      // --------------------------
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
      // --------------------

      const loader = new OBJLoader();

      loader.load(
        // resource URL
        './models/soccerPlayer.obj',
         object => {
          this._target = object;
          this._params.scene.add(this._target);      
        })
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
      
      //add to scene because gltf uses this syntax
      const controlObject = {scene: null}
      controlObject.scene = this._target;

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