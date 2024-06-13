import { MTLLoader } from '/js/MTLLoader.js';
import { OBJLoader } from '/js/OBJLoader.js';
import * as THREE from '/js/three.module.js';
import { moleculeGeometries, moleculeMaterials } from '/js/scenes/legacy-rendering-data.js';

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

/**
 * This function exists for legacy reasons. It's used to draw molecules saved
 * in scenes before the way molecules were rendered was changed
 */
export function drawMolecule(molObject, drawPosition, drawRotation, drawScale){
    let moleculeGroup = new THREE.Group();

    if(drawPosition === undefined){
        drawPosition = new THREE.Vector3(0,0,0.5);
    }
    
    if(drawRotation === undefined){
        drawRotation = {
            _x: 0,
            _y: 0,
            _z: 0}
    }

    if(drawScale === undefined){
        drawScale = {
            x: 1,
            y: 1,
            z: 1}
    }

    let firstPoint = new THREE.Vector3(
        molObject.x, 
        molObject.y, 
        molObject.z);

    let limits = {
        x: {
            min: firstPoint.x,
            max: firstPoint.x
        },
        y: {
            min: firstPoint.y,
            max: firstPoint.y
        },
        z: {
            min: firstPoint.z,
            max: firstPoint.z
        }
    }

    for(let item of molObject.atoms){
        let point = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        if(Number(point.x) < Number(limits.x.min)){
            limits.x.min = point.x;
        }
        if(Number(point.x) > Number(limits.x.max)){
            limits.x.max = point.x;
        }
        if(Number(point.y) < Number(limits.y.min)){
            limits.y.min = point.y;
        }
        if(Number(point.y) > Number(limits.y.max)){
            limits.y.max = point.y;
        }
        if(Number(point.z) < Number(limits.z.min)){
            limits.z.min = point.z;
        }
        if(Number(point.z) > Number(limits.z.max))  {
            limits.z.max = point.z;
        }
    }

    let moleculeCenter = new THREE.Vector3(
        (Number((limits.x.min)) + Number(limits.x.max))/2,
        (Number((limits.y.min)) + Number(limits.y.max))/2,
        (Number((limits.z.min)) + Number(limits.z.max))/2);
                
    for(let item of molObject.atoms){
        const sphere = new THREE.Mesh( moleculeGeometries[item.type], moleculeMaterials[item.type] );
        sphere.position.x = item.position.x - moleculeCenter.x;
        sphere.position.y = item.position.y - moleculeCenter.y;
        sphere.position.z = item.position.z - moleculeCenter.z;
        moleculeGroup.add( sphere );
    }

    moleculeGroup.position.x = drawPosition.x;
    moleculeGroup.position.y = drawPosition.y;
    moleculeGroup.position.z = drawPosition.z;

    moleculeGroup.rotation.x = drawRotation._x;
    moleculeGroup.rotation.y = drawRotation._y;
    moleculeGroup.rotation.z = drawRotation._z;

    
    moleculeGroup.scale.x = drawScale.x;
    moleculeGroup.scale.y = drawScale.y;
    moleculeGroup.scale.z = drawScale.z;

    return moleculeGroup;
}
