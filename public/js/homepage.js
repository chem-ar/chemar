import 
import { OrbitControls } from '/js/OrbitControls.js';
import * as THREE from '/js/three.module.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const moleculeGeometries = {
  C: new THREE.SphereGeometry(0.8, 32, 32),
  H: new THREE.SphereGeometry(0.3, 32, 32),
  O: new THREE.SphereGeometry(0.5, 32, 32),
  N: new THREE.SphereGeometry(0.6, 32, 32),
  S: new THREE.SphereGeometry(0.8, 32, 32),
  P: new THREE.SphereGeometry(0.9, 32, 32),
  F: new THREE.SphereGeometry(0.4, 32, 32),
  Cl: new THREE.SphereGeometry(0.5, 32, 32),
  Br: new THREE.SphereGeometry(0.6, 32, 32),
  I: new THREE.SphereGeometry(0.7, 32, 32),
};
const moleculeMaterials = {
  C: new THREE.MeshBasicMaterial({ color: 0x333333 }),
  H: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  O: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  N: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  S: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  P: new THREE.MeshBasicMaterial({ color: 0xff00ff }),
  F: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  Cl: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  Br: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
};

function drawMolecule(molFile) {
  const molObject = molFileToJSON(molFile);

  for (let item of molObject.atoms) {
    const sphere = new THREE.Mesh(
      moleculeGeometries[item.type],
      moleculeMaterials[item.type]
    );
    sphere.position.x = item.position.x;
    sphere.position.y = item.position.y;
    sphere.position.z = item.position.z;
    scene.add(sphere);
  }
}

function init(CSID) {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  fetch("molfiles/" + CSID + ".mol")
    .then((response) => response.text())
    .then((molFile) => {
      drawMolecule(molFile);
    });

  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}