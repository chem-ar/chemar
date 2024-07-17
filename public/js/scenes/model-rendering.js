import { BoxGeometry, MeshBasicMaterial, Mesh } from '/js/three.module.js';

export function createModel(modelData, Title, position, rotation, scale) {
    const { name, description, files: { obj, mtl } } = modelData;
    // position, rotation, and scale might be undefined! set a default value if so
    
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const fakeModel = new Mesh(geometry, material);

    return fakeModel;
}