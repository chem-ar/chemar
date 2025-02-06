import { MTLLoader } from '/js/MTLLoader.js';
import { OBJLoader } from '/js/OBJLoader.js';
import { GLTFLoader } from '/js/GLTFLoader.js'; // Import the GLTFLoader

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

        // Load object
        object = await objLoader.loadAsync(`/modelfiles/${files.obj}`);
    }
    // If there is a .gltf file, use the GLTFLoader
    else if (files.gltf) {
        const gltfLoader = new GLTFLoader();

        // Load .gltf file
        const gltf = await gltfLoader.loadAsync(`/modelfiles/${files.gltf}`);
        object = gltf.scene; // The model is contained in the scene of the glTF
    }

    // Set position, rotation, and scale if provided
    if (object) {
        object.position.z = 1;

        if (position) {
            object.position.set(position.x, position.y, position.z);
        }
        if (rotation) {
            object.rotation.set(
                rotation.x ?? rotation._x,
                rotation.y ?? rotation._y,
                rotation.z ?? rotation._z
            );
        }
        if (scale) {
            object.scale.set(scale.x, scale.y, scale.z);
        }
    }

    return object;
}

