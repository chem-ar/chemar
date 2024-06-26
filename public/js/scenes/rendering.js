import { MTLLoader } from '/js/MTLLoader.js';
import { OBJLoader } from '/js/OBJLoader.js';
import * as THREE from '/js/three.module.js';

export async function createModel(modelData, position, rotation, scale) {
    const { files: { obj, mtl } } = modelData;

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const materials = await mtlLoader.loadAsync(`/modelfiles/${mtl}`);
    materials.preload();
    objLoader.setMaterials(materials);

    const object = await objLoader.loadAsync(`/modelfiles/${obj}`);
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

    return object;
}
