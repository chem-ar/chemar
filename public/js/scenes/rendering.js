import { MTLLoader } from '/js/MTLLoader.js';
import { OBJLoader } from '/js/OBJLoader.js';
import { GLTFLoader } from '/js/GLTFLoader.js'; 
import * as THREE from '/js/three.module.js';

export async function createModel(modelData, position, rotation, scale) {
    const { files } = modelData;
    let object = null;
    let mixer = null; 

    if (files.obj && files.mtl) {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        const materials = await mtlLoader.loadAsync(`/modelfiles/${files.mtl}`);
        materials.preload();
        objLoader.setMaterials(materials);
        object = await objLoader.loadAsync(`/modelfiles/${files.obj}`);
    } 
    
    else if (files.gltf || files.glb) {
        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(`/${files.gltf || files.glb}`);
        object = gltf.scene;

        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(object);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    }

    if (object) {
        object.position.z = 1;
        if (position) object.position.set(position.x, position.y, position.z);
        if (rotation) object.rotation.set(rotation.x ?? rotation._x, rotation.y ?? rotation._y, rotation.z ?? rotation._z);
        if (scale) object.scale.set(scale.x, scale.y, scale.z);
    }

    return { object, mixer }; 
}


