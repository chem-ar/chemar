export function addMolToMenu(molecule, Title, molMenu) {
    let moleculeItem = document.createElement('div');
    moleculeItem.classList = 'list-group-item list-group-item-action mb-2';

    let moleculeItemButton = document.createElement('button');
    moleculeItemButton.classList = 'btn btn-outline-light btn-block';
    moleculeItemButton.innerText = Title;
    
    let moleculeCollapse = document.createElement('div');
    moleculeCollapse.classList = 'collapse';
    moleculeCollapse.id = 'molecule' + molecule.uuid;
    
    let moleculeCollapseContent = document.createElement('div');
    moleculeCollapseContent.classList = 'card card-body bg-dark border-light text-white  my-2';
    moleculeCollapse.appendChild(moleculeCollapseContent);

    let moleculePositionRow = document.createElement('div');
    moleculeCollapseContent.appendChild(moleculePositionRow);

    let moleculePositionRowText = document.createElement('h5');
    moleculePositionRow.appendChild(moleculePositionRowText);
    
    moleculePositionRowText.innerText = "Position";
    
    let moleculePositionXRow = document.createElement('div');
    moleculePositionXRow.classList = 'row';
    moleculePositionRow.appendChild(moleculePositionXRow);

    let moleculePositionXLabel = document.createElement('div');
    moleculePositionXLabel.classList = 'col-1';
    moleculePositionXLabel.innerText = "X";
    moleculePositionXRow.appendChild(moleculePositionXLabel);

    let moleculePositionXText = document.createElement('input');
    moleculePositionXText.classList = 'form-control form-control-sm mb-2';
    moleculePositionXText.type = 'number';
    moleculePositionXText.value = molecule.position.x;

    // molecule pos x
    moleculePositionXText.addEventListener("input", function(event) {
        molecule.position.x = moleculePositionXText.value;
        moleculePositionXSlider.value = moleculePositionXText.value;

    });

    let moleculePositionXTextCol = document.createElement('div');
    moleculePositionXTextCol.classList = 'col-3';
    moleculePositionXTextCol.appendChild(moleculePositionXText);
    moleculePositionXRow.appendChild(moleculePositionXTextCol);

    let moleculePositionXSlider = document.createElement('input');
    moleculePositionXSlider.classList = 'form-range mb-2';
    moleculePositionXSlider.type = 'range';
    moleculePositionXSlider.min = '0';
    moleculePositionXSlider.max = '11';
    moleculePositionXSlider.step = '0.01';
    moleculePositionXSlider.value = molecule.position.x;

    moleculePositionXSlider.addEventListener("input", function(event) {
        molecule.position.x = moleculePositionXSlider.value;
        moleculePositionXText.value = moleculePositionXSlider.value;
    });

    let moleculePositionXSliderCol = document.createElement('div');
    moleculePositionXSliderCol.classList = 'col-8';
    moleculePositionXSliderCol.appendChild(moleculePositionXSlider);
    moleculePositionXRow.appendChild(moleculePositionXSliderCol);
    
    let moleculePositionYRow = document.createElement('div');
    moleculePositionYRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculePositionYRow);

    let moleculePositionYLabel = document.createElement('div');
    moleculePositionYLabel.classList = 'col-1';
    moleculePositionYLabel.innerText = "Y";
    moleculePositionYRow.appendChild(moleculePositionYLabel);

    let moleculePositionYText = document.createElement('input');
    moleculePositionYText.classList = 'form-control form-control-sm mb-2';
    moleculePositionYText.type = 'number';
    moleculePositionYText.value = molecule.position.y;

    // molecule pos y
    moleculePositionYText.addEventListener("input", function(event) {
        molecule.position.y = moleculePositionYText.value;
        moleculePositionYSlider.value = moleculePositionYText.value;
    });

    let moleculePositionYTextCol = document.createElement('div');
    moleculePositionYTextCol.classList = 'col-3';
    moleculePositionYTextCol.appendChild(moleculePositionYText);
    moleculePositionYRow.appendChild(moleculePositionYTextCol);

    let moleculePositionYSlider = document.createElement('input');
    moleculePositionYSlider.classList = 'form-range mb-2';
    moleculePositionYSlider.type = 'range';
    moleculePositionYSlider.min = '0';
    moleculePositionYSlider.max = '11';
    moleculePositionYSlider.step = '0.01';
    moleculePositionYSlider.value = molecule.position.y;

    moleculePositionYSlider.addEventListener("input", function(event) {
        molecule.position.y = moleculePositionYSlider.value;
        moleculePositionYText.value = moleculePositionYSlider.value;
    });

    let moleculePositionYSliderCol = document.createElement('div');
    moleculePositionYSliderCol.classList = 'col-8';
    moleculePositionYSliderCol.appendChild(moleculePositionYSlider);
    moleculePositionYRow.appendChild(moleculePositionYSliderCol);

    let moleculePositionZRow = document.createElement('div');
    moleculePositionZRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculePositionZRow);

    let moleculePositionZLabel = document.createElement('div');
    moleculePositionZLabel.classList = 'col-1';
    moleculePositionZLabel.innerText = "Z";
    moleculePositionZRow.appendChild(moleculePositionZLabel);

    let moleculePositionZText = document.createElement('input');
    moleculePositionZText.classList = 'form-control form-control-sm mb-2';
    moleculePositionZText.type = 'number';
    moleculePositionZText.value = molecule.position.z;
    
    // molecule pos z
    moleculePositionZText.addEventListener("input", function(event) {
        molecule.position.z = moleculePositionZText.value;
        // Add to the array.
        moleculePositionZSlider.value = moleculePositionZText.value;
    });

    let moleculePositionZTextCol = document.createElement('div');
    moleculePositionZTextCol.classList = 'col-3';
    moleculePositionZTextCol.appendChild(moleculePositionZText);
    moleculePositionZRow.appendChild(moleculePositionZTextCol);

    let moleculePositionZSlider = document.createElement('input');
    moleculePositionZSlider.classList = 'form-range mb-2';
    moleculePositionZSlider.type = 'range';
    moleculePositionZSlider.min = '0';
    moleculePositionZSlider.max = '11';
    moleculePositionZSlider.step = '0.01';
    moleculePositionZSlider.value = molecule.position.z;
    
    
    // molecule Z event listener
    moleculePositionZSlider.addEventListener("input", function(event) {
        molecule.position.z = moleculePositionZSlider.value;
        moleculePositionZText.value = moleculePositionZSlider.value;
    });
    
    let moleculePositionZSliderCol = document.createElement('div');
    moleculePositionZSliderCol.classList = 'col-8';
    moleculePositionZSliderCol.appendChild(moleculePositionZSlider);
    moleculePositionZRow.appendChild(moleculePositionZSliderCol);

    //ROTATION
    let moleculeRotationRow = document.createElement('div');
    
    moleculeRotationRow.innerHTML = "<h5>Rotation</h5>";
    moleculeCollapseContent.appendChild(moleculeRotationRow);


    let moleculeRotationXRow = document.createElement('div');
    moleculeRotationXRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculeRotationXRow);


    let moleculeRotationXLabel = document.createElement('div');
    moleculeRotationXLabel.classList = 'col-1';
    moleculeRotationXLabel.innerText = "X";
    moleculeRotationXRow.appendChild(moleculeRotationXLabel);

    let moleculeRotationXText = document.createElement('input');
    moleculeRotationXText.classList = 'form-control form-control-sm mb-2';
    moleculeRotationXText.type = 'number';
    moleculeRotationXText.value = molecule.rotation.x;
    
    moleculeRotationXText.addEventListener("input", function (event) {
        molecule.rotation.x = moleculeRotationXText.value;
        moleculeRotationXSlider.value = moleculeRotationXText.value;
    });
    
    let moleculeRotationXTextCol = document.createElement('div');
    moleculeRotationXTextCol.classList = 'col-3';
    moleculeRotationXTextCol.appendChild(moleculeRotationXText);
    moleculeRotationXRow.appendChild(moleculeRotationXTextCol);

    let moleculeRotationXSlider = document.createElement('input');
    moleculeRotationXSlider.classList = 'form-range mb-2';
    moleculeRotationXSlider.type = 'range';
    moleculeRotationXSlider.min = -Math.PI;
    moleculeRotationXSlider.max = Math.PI;
    moleculeRotationXSlider.step = '0.01';
    moleculeRotationXSlider.value = molecule.rotation.x;
    
    moleculeRotationXSlider.addEventListener("input", function (event) {
        molecule.rotation.x = moleculeRotationXSlider.value;
        moleculeRotationXText.value = moleculeRotationXSlider.value;
    });
    
    let moleculeRotationXSliderCol = document.createElement('div');
    moleculeRotationXSliderCol.classList = 'col-8';
    moleculeRotationXSliderCol.appendChild(moleculeRotationXSlider);
    moleculeRotationXRow.appendChild(moleculeRotationXSliderCol);

    //Rotation Y
    let moleculeRotationYRow = document.createElement('div');
    moleculeRotationYRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculeRotationYRow);

    let moleculeRotationYLabel = document.createElement('div');
    moleculeRotationYLabel.classList = 'col-1';
    moleculeRotationYLabel.innerText = "Y";
    moleculeRotationYRow.appendChild(moleculeRotationYLabel);

    let moleculeRotationYText = document.createElement('input');
    moleculeRotationYText.classList = 'form-control form-control-sm mb-2';
    moleculeRotationYText.type = 'number';
    moleculeRotationYText.value = molecule.rotation.y;
    
    moleculeRotationYText.addEventListener("input", function (event) {
        molecule.rotation.y = moleculeRotationYText.value;
        moleculeRotationYSlider.value = moleculeRotationYText.value;
    });
    
    let moleculeRotationYTextCol = document.createElement('div');
    moleculeRotationYTextCol.classList = 'col-3';
    moleculeRotationYTextCol.appendChild(moleculeRotationYText);
    moleculeRotationYRow.appendChild(moleculeRotationYTextCol);

    let moleculeRotationYSlider = document.createElement('input');
    moleculeRotationYSlider.classList = 'form-range mb-2';
    moleculeRotationYSlider.type = 'range';
    moleculeRotationYSlider.min = -Math.PI;
    moleculeRotationYSlider.max = Math.PI;
    moleculeRotationYSlider.step = '0.01';
    moleculeRotationYSlider.value = molecule.rotation.y;
    
    moleculeRotationYSlider.addEventListener("input", function (event) {
        molecule.rotation.y = moleculeRotationYSlider.value;
        moleculeRotationYText.value = moleculeRotationYSlider.value;
    });

    let moleculeRotationYSliderCol = document.createElement('div');
    moleculeRotationYSliderCol.classList = 'col-8';
    moleculeRotationYSliderCol.appendChild(moleculeRotationYSlider);
    moleculeRotationYRow.appendChild(moleculeRotationYSliderCol);

    //Rotation Z
    let moleculeRotationZRow = document.createElement('div');
    moleculeRotationZRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculeRotationZRow);

    let moleculeRotationZLabel = document.createElement('div');
    moleculeRotationZLabel.classList = 'col-1';
    moleculeRotationZLabel.innerText = "Z";
    moleculeRotationZRow.appendChild(moleculeRotationZLabel);

    let moleculeRotationZText = document.createElement('input');
    moleculeRotationZText.classList = 'form-control form-control-sm mb-2';
    moleculeRotationZText.type = 'number';
    moleculeRotationZText.value = molecule.rotation.z;
    
    moleculeRotationZText.addEventListener("input", function (event) {
        molecule.rotation.z = moleculeRotationZText.value;
        moleculeRotationZSlider.value = moleculeRotationZText.value;
    });

    let moleculeRotationZTextCol = document.createElement('div');
    moleculeRotationZTextCol.classList = 'col-3';
    moleculeRotationZTextCol.appendChild(moleculeRotationZText);
    moleculeRotationZRow.appendChild(moleculeRotationZTextCol);

    let moleculeRotationZSlider = document.createElement('input');
    moleculeRotationZSlider.classList = 'form-range mb-2';
    moleculeRotationZSlider.type = 'range';
    moleculeRotationZSlider.min = -Math.PI;
    moleculeRotationZSlider.max = Math.PI;
    moleculeRotationZSlider.step = '0.01';
    moleculeRotationZSlider.value = molecule.rotation.z;
    
    moleculeRotationZSlider.addEventListener("input", function (event) {
        molecule.rotation.z = moleculeRotationZSlider.value;
        moleculeRotationZText.value = moleculeRotationZSlider.value;
    });

    let moleculeRotationZSliderCol = document.createElement('div');
    moleculeRotationZSliderCol.classList = 'col-8';
    moleculeRotationZSliderCol.appendChild(moleculeRotationZSlider);
    moleculeRotationZRow.appendChild(moleculeRotationZSliderCol);

    //Scale
    let moleculeScaleRow = document.createElement('div');
    moleculeScaleRow.classList = 'row';
    moleculeCollapseContent.appendChild(moleculeScaleRow);
    
    moleculeScaleRow.innerHTML = "<h5>Scale</h5>";
    moleculeCollapseContent.appendChild(moleculeScaleRow);

    let moleculeScaleText = document.createElement('input');
    moleculeScaleText.classList = 'form-control form-control-sm mb-2';
    moleculeScaleText.type = 'number';
    
    // assumes scale.x == scale.y == scale.z
    moleculeScaleText.value = molecule.scale.x;
    
    moleculeScaleText.addEventListener("input", function (event) {
        molecule.scale.z = moleculeScaleText.value;
        molecule.scale.x = moleculeScaleText.value;
        molecule.scale.y = moleculeScaleText.value;
        moleculeScaleSlider.value = moleculeScaleText.value;
    });

    let moleculeScaleTextCol = document.createElement('div');
    moleculeScaleTextCol.classList = 'col-3';
    moleculeScaleTextCol.appendChild(moleculeScaleText);
    moleculeScaleRow.appendChild(moleculeScaleTextCol);

    let moleculeScaleSlider = document.createElement('input');
    moleculeScaleSlider.classList = 'form-range mb-2';
    moleculeScaleSlider.type = 'range';
    moleculeScaleSlider.min = 0.01;
    moleculeScaleSlider.max = 2;
    moleculeScaleSlider.step = '0.01';
    
    // assumes scale.x == scale.y == scale.z
    moleculeScaleSlider.value = molecule.scale.x;

    moleculeScaleSlider.addEventListener("input", function (event) {
        molecule.scale.z = moleculeScaleText.value;
        molecule.scale.x = moleculeScaleText.value;
        molecule.scale.y = moleculeScaleText.value;

        moleculeScaleText.value = moleculeScaleSlider.value;
    });

    let moleculeScaleSliderCol = document.createElement('div');
    moleculeScaleSliderCol.classList = 'col-9';
    moleculeScaleSliderCol.appendChild(moleculeScaleSlider);
    moleculeScaleRow.appendChild(moleculeScaleSliderCol);


    moleculeItemButton.addEventListener("click", function(event) {
        event.preventDefault();
        let moleculeCollapse = document.getElementById('molecule' +  molecule.uuid);
        if(moleculeCollapse.classList.contains('show')){
            moleculeCollapse.classList.remove('show');
        }else{
            moleculeCollapse.classList.add('show');
        }
    });

    molMenu.appendChild(moleculeItemButton);
    molMenu.appendChild(moleculeCollapse);
    molMenu.appendChild(moleculeItem);
}
