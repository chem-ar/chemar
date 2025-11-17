import { MTLLoader } from '/js/MTLLoader.js';
import { OBJLoader } from '/js/OBJLoader.js';
import { GLTFLoader } from '/js/GLTFLoader.js'; // Import the GLTFLoader
import * as THREE from 'three';

export async function createModel(modelData, position, rotation, scale) {
    const { files } = modelData;

    let object = null;

    // If there are .obj and .mtl files, use the OBJLoader and MTLLoader
    if (files.obj && files.mtl) {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        // Load materials
        const materials = await mtlLoader.loadAsync(`/modelfiles/${files.mtl}`);
        materials.preload();
        objLoader.setMaterials(materials);

        object = await objLoader.loadAsync(`/modelfiles/${files.obj}`);
    }
    // If there is a .gltf file, use the GLTFLoader
    else if (files.gltf) {
        const gltfLoader = new GLTFLoader();

        // Load .gltf file
        const gltf = await gltfLoader.loadAsync(`/modelfiles/${files.gltf}`);
        object = gltf.scene;
    }
    else if (files.glb){
        const gltfLoader = new GLTFLoader();

        // Load .gltf file
        const glb = await gltfLoader.loadAsync(`/modelfiles/${files.glb}`);
        object = glb.scene;
    }



    if (!object) return null;
    
        const pivot = new THREE.Group();
        pivot.add(object);
        

        object.position.set(0, 0, 0);
        object.rotation.set(0, 0, 0);

        // apply transforms to pivot instead
    if (position) pivot.position.set(position.x, position.y, position.z);
    if (rotation)
        pivot.rotation.set(
            rotation.x ?? rotation._x,
            rotation.y ?? rotation._y,
            rotation.z ?? rotation._z
        );
    if (scale) pivot.scale.set(scale.x, scale.y, scale.z);

    // optionally lift it slightly off paper for clarity
    pivot.position.z += 0.5;

    return pivot;
}

