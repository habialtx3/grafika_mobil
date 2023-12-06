import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import * as dat from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
};

const loader = new GLTFLoader(loadingManager);

//mobil
loader.load("../assets/audi_r8_3d_model.glb", (gltf) => {
  const model = gltf.scene;
  model.scale.set(2, 2, 2);
  model.position.y = 1.7;
  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });
  scene.add(model);
});

//basement
loader.load("../assets/bg.glb", (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);

  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });

  scene.add(model);
});

camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 8;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);

directionalLight.intensity = 1;

scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);

const gui = new dat.GUI();
const option = {
  cubeColor: "#ffea00",
  sphereColor: "#ffff00",
};
gui.addColor(option, "cubeColor").onChange(function (e) {
  cube.material.color.set(e);
});

const tl = gsap.timeline();
window.addEventListener("DOMContentLoaded", function () {
  tl.to(
    camera.position, {
    y: 8,
    z: -4,
    duration:5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    },
  }).to({}, { duration: 0.000001, onComplete: moveCamera })
  .to(camera.position, {
    z: 2,
    y: 3,
    x:-4,
    duration:5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    },
    })
    .to({}, { duration: 0.000001, onComplete: moveCamera })
  .to(camera.position, 
    {
    x: 5,
    z:0,
    duration: 5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
      },
    }) 
      .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(camera.position, 
      {
      x: 1,
      z:2,
      duration: 5,
      onUpdate: function () {
        camera.lookAt(-2, 0, 1);
      },
    }) .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(
      camera.position, {
      y: 8,
      z: -2,
      duration:5,
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    })
    .repeat(-1);
});
function moveCamera() {
  camera.position.set(0, 4, 10);
  console.log("Camera moved to (0, 0, 0)");
  tlNext();
}

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  //   controls.update();
  renderer.render(scene, camera);
};

animate();
