import * as THREE from '../build/three.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

var container, controls;
var camera, scene, renderer;

init();
render();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(- 1.8, 0.6, 2.7);

    scene = new THREE.Scene();

    LoadCubeMap();
    AddLights();
    LoadModel();
    SetRenderer();
    SetControls();

    window.addEventListener('resize', onWindowResize, false);
}

function LoadCubeMap() {
    scene.background = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Park2/')
        .load([
            'posx.jpg',
            'negx.jpg',
            'posy.jpg',
            'negy.jpg',
            'posz.jpg',
            'negz.jpg'
        ]);

}

function AddLights() {
    var light = new THREE.SpotLight(0xffffff, 4);
    light.position.set(50, 50, 50);
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    light.shadow.mapSize.width = 1024 * 4;
    light.shadow.mapSize.height = 1024 * 4;
    scene.add(light);

    var light2 = new THREE.SpotLight(0xffffff, 4);
    light2.position.set(-50, 50, -50);
    light2.castShadow = false;
    scene.add(light2);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x454545, 4);
    scene.add(hemiLight);
}

function LoadModel() {

    var loader = new GLTFLoader().setPath('models/gltf/1972_datsun_240k/glTF/');
    loader.load('1972_datsun_240k.gltf', function (gltf) {

        gltf.scene.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;                
            }
        });

        scene.add(gltf.scene);
        render();
    });
}

function SetRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
}

function SetControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, - 0.2);
    //controls.enableZoom = false;
    controls.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function render() {
    renderer.render(scene, camera);
}
