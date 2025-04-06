import { OrbitControls } from '/js/OrbitControls.js';
import * as THREE from '/js/three.module.js';

let scene1, camera, renderer, controls;
let axesHelper, markerLocationHelper;
let ambientLight;
let paperGeometry, paperMaterial, paperPlane;
let markerGeometry, markerMaterial, markerPlane;
const loader = new THREE.TextureLoader();
let sceneMolecules = [];
let mixers = []; 
const clock = new THREE.Clock(); 

export function initScene(pngFile, markerData, threeArea, window) {
    scene1 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    scene1.add(camera);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 1000, 100);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene1.add(spotLight);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeArea.appendChild(renderer.domElement);
    window.addEventListener('resize', () => { onResize(window) }, false);

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene1.add(ambientLight);

    paperMaterial = new THREE.MeshLambertMaterial({
        map: loader.load(`/images/${pngFile}`)
    });
    paperMaterial.side = THREE.DoubleSide;
    var pageTint = new THREE.Color(0xCACFD2);
    paperMaterial.color = pageTint;

    let paperDimensions = new THREE.Vector2(8.5, 11);
    paperGeometry = new THREE.PlaneGeometry(paperDimensions.y, paperDimensions.x);
    paperPlane = new THREE.Mesh(paperGeometry, paperMaterial);
    scene1.add(paperPlane);
    paperPlane.position.set(paperDimensions.y / 2, paperDimensions.x / 2, 0);

    markerMaterial = new THREE.MeshLambertMaterial({
        map: loader.load('/test_marker.png')
    });
    let markerDimensions = new THREE.Vector2(1, 1);
    markerGeometry = new THREE.PlaneGeometry(markerDimensions.x, markerDimensions.y);
    markerPlane = new THREE.Mesh(markerGeometry, markerMaterial);
    markerPlane.position.z = 0.1;
    scene1.add(markerPlane);

    markerLocationHelper = new THREE.AxesHelper(10);
    scene1.add(markerLocationHelper);

    axesHelper = new THREE.AxesHelper(50);
    scene1.add(axesHelper);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 10;
    controls.minDistance = 1;
    camera.position.set(0, 0, 2);

    // Safe handling explicitly here:
    markerLocationHelper.position.set(
        markerData.position?.x ?? 0,
        markerData.position?.y ?? 0,
        markerData.position?.z ?? 0
    );

    markerPlane.position.set(
        markerData.position?.x ?? 0,
        markerData.position?.y ?? 0,
        (markerData.position?.z ?? 0) + 0.1
    );

    // Default rotation and scale explicitly handled
    markerPlane.rotation.set(
        markerData.rotation?.x ?? 0,
        markerData.rotation?.y ?? 0,
        markerData.rotation?.z ?? 0
    );

    markerPlane.scale.set(
        markerData.scale?.x ?? 1,
        markerData.scale?.y ?? 1,
        markerData.scale?.z ?? 1
    );

    animate();
}


function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); 
    mixers.forEach(mixer => mixer.update(delta)); 
    renderer.render(scene1, camera);
    controls.update();
}

function onResize(window) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function addModelToScene(modelInfo, modelData, cjson) {
    const { object, mixer } = modelData;
    if (mixer) mixers.push(mixer); 

    const newMolData = {
        Title: modelInfo.name,
        molecule: object,
        cjson: cjson,
        position: object.position,
        rotation: object.rotation,
        scale: object.scale,
        modelInfo: modelInfo,
    };

    sceneMolecules.push(newMolData);
    scene1.add(object);
}

export function onMarkerXChange(event) {
    const newMarkerX = event.target.value;
    markerLocationHelper.position.x = newMarkerX;
    markerPlane.position.x = newMarkerX;
}

export function onMarkerYChange(event) {
    const newMarkerY = event.target.value;
    markerLocationHelper.position.y = newMarkerY;
    markerPlane.position.y = newMarkerY;
}

export function updateSceneImg(fileSrc) {
    paperMaterial.map = loader.load(fileSrc);
    paperMaterial.needsUpdate = true;
}

export function exportSceneData() {
    const markerData = {
        position: {
            x: markerPlane.position.x,
            y: markerPlane.position.y,
            z: markerPlane.position.z
        },
        rotation: {
            x: markerPlane.rotation.x,
            y: markerPlane.rotation.y,
            z: markerPlane.rotation.z
        },
        scale: {
            x: markerPlane.scale.x,
            y: markerPlane.scale.y,
            z: markerPlane.scale.z
        }
    };

    const sceneMolecules = window.currentSceneModels.map(model => ({
        modelInfo: {
            id: model.id,
            name: model.name,
            file_path: model.file_path.replace(/\\/g, '/').replace(/^public\//, ''),
            upload_date: model.upload_date,
            desc: model.desc
        },
        position: {
            x: model.object.position.x,
            y: model.object.position.y,
            z: model.object.position.z
        },
        rotation: {
            x: model.object.rotation.x,
            y: model.object.rotation.y,
            z: model.object.rotation.z,
            isEuler: true
        },
        scale: {
            x: model.object.scale.x,
            y: model.object.scale.y,
            z: model.object.scale.z
        },
        animations: model.animations || []
    }));

    return { markerData, sceneMolecules };
}


export function adjustMolToMarker(mol, marker) {
    [mol.position.y, mol.position.z] = [mol.position.z, -mol.position.y];
    mol.rotateX(Math.PI / 2);
    mol.position.set(
        mol.position.x - Number(marker.position.x),
        mol.position.y - Number(marker.position.z),
        mol.position.z + Number(marker.position.y)
    );
}
