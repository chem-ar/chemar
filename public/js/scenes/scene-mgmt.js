import { OrbitControls } from '/js/OrbitControls.js';
import * as THREE from '/js/three.module.js';

let scene1, camera, renderer, controls;

let axesHelper, markerLocationHelper;
let ambientLight;

let paperGeometry, paperMaterial, paperPlane;
let markerGeometry, markerMaterial, markerPlane;

const loader = new THREE.TextureLoader();

let sceneMolecules = [];

export function initScene(pngFile, markerData, threeArea, window){

    scene1 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 4000 );

    
    scene1.add( camera );

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    threeArea.appendChild( renderer.domElement );

    window.addEventListener('resize', () => { onResize(window) }, false);    

    ambientLight = new THREE.AmbientLight( 0xffffff );
    scene1.add( ambientLight );

    // Load an image file into a custom material
    paperMaterial = new THREE.MeshLambertMaterial({
        map: loader.load(`/images/${pngFile}`)
    });
    paperMaterial.side = THREE.DoubleSide;

    let paperDimensions = new THREE.Vector2( 8.5, 11 );
    paperGeometry = new THREE.PlaneGeometry( paperDimensions.y, paperDimensions.x );
    paperPlane = new THREE.Mesh( paperGeometry, paperMaterial );
    scene1.add( paperPlane );
    paperPlane.position.z = 0;
    paperPlane.position.x = paperDimensions.y/2;
    paperPlane.position.y = paperDimensions.x/2;


    markerMaterial = new THREE.MeshLambertMaterial({
        map: loader.load('/test_marker.png')
    });

    let markerDimensions = new THREE.Vector2( 1, 1 );
    markerGeometry = new THREE.PlaneGeometry( markerDimensions.x, markerDimensions.y );
    markerPlane = new THREE.Mesh( markerGeometry, markerMaterial );
    markerPlane.position.z = 0.1;
    scene1.add( markerPlane );

    markerLocationHelper = new THREE.AxesHelper( 10 );
    scene1.add( markerLocationHelper );

    axesHelper = new THREE.AxesHelper( 50 );
    scene1.add( axesHelper );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.dampingFactor = 10;
    controls.minDistance = 1;

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;

    markerLocationHelper.position.x = markerData.position.x;
    markerPlane.position.x = markerData.position.x;

    markerLocationHelper.position.y = markerData.position.y;
    markerPlane.position.y = markerData.position.y;

    animate();
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene1, camera );
    controls.update();
}

function onResize(window) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function addModelToScene(modelInfo, model, cjson) {
    const newMolData = {
        Title: modelInfo.name,
        molecule: model,
        cjson: cjson,
        position: model.position,
        rotation: model.rotation,
        scale: model.scale,
        modelInfo: modelInfo,
        
        // want to store vals instead of reference to obj
        initialPosition: { ...model.position }
    };

    sceneMolecules.push(newMolData);
    scene1.add( model );
}

export function onMarkerXChange(event) {
    const newMarkerX = event.target.value;
    markerLocationHelper.position.x = newMarkerX;
    markerPlane.position.x = newMarkerX;

    sceneMolecules.forEach(({ molecule, initialPosition }) => {
        molecule.position.x = Number(initialPosition.x) + Number(newMarkerX);
    });
}

export function onMarkerYChange(event) {
    const newMarkerY = event.target.value;
    markerLocationHelper.position.y = newMarkerY;
    markerPlane.position.y = newMarkerY;

    sceneMolecules.forEach(({ molecule, initialPosition }) => {
        molecule.position.y = Number(initialPosition.y) + Number(newMarkerY);
    });
}

export function updateSceneImg(fileSrc) {
    paperMaterial.map = loader.load(fileSrc);
    paperMaterial.needsUpdate = true;
}

export function exportSceneData() {
    const { position, rotation: { x, y, z }, scale } = markerPlane;
    const markerData = { position, rotation: { x, y, z }, scale };
    return { markerData, sceneMolecules };
}

/**
 * In the scene viewer, molecules are rendered relative to the marker, unlike 
 * the scene editor where everything is relative some origin (0, 0, 0). As a 
 * result, molecules need to be adjusted using this function.
 * 
 * The consequences of this are:
 * - The Y and Z axes need to be swapped (Y = Z, Z = -Y)
 * - Molecules need to be rotated (they are facing the floor instead of 
 *   facing us)
 * - Molecules' positions need to be relative to the marker, not the origin
 * 
 * @returns void. The passed molecule is changed in place
 */
export function adjustMolToMarker(mol, marker) {
    [mol.position.y, mol.position.z] = [mol.position.z, -mol.position.y];
    mol.rotateX(Math.PI / 2);

    mol.position.x -= Number(marker.position.x);
    mol.position.y -= Number(marker.position.z);
    mol.position.z += Number(marker.position.y);
}