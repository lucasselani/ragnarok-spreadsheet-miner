var dropCraftGear = require('./DropCraftGear');

function filterObjectRow(rows) {
    var firstLine = true;
    var objectCounter = 0;
    var objectRow = [];
    var firstRow;
    var secondRow;
    rows.forEach((row) => {
        if (row.length) {
            if (!firstLine) {
                objectCounter++;
                if (objectCounter == 1) {
                    firstRow = row;
                } else if (objectCounter == 2) {
                    secondRow = row;
                } else {
                    var finalRow = firstRow.concat(secondRow).concat(row);
                    objectRow.push(finalRow);
                    objectCounter = 0;
                }
            } else {
                firstLine = false;
            }
        }
    });
    return objectRow;
}

function removeTrashFromArray(rows) {
    var newRows = []
    rows.forEach((row) => {
        var newCells = []
        row.forEach((cell) => {
            if (cell.length) {
                cells = cell.split('\n');
                cells.forEach((splittedCell) => {
                    splittedCell.replace(/(\r\n|\n|\r)/gm, "");
                    if (/\d|\w/.test(splittedCell) && !splittedCell.includes('*')) {
                        newCells.push(splittedCell);
                    }
                })
            }
        });
        newRows.push(newCells);
    });
    return newRows;
}

function createDropCraftGearList(rows) {
    var dropCraftGearList = []
    rows.forEach(row => {
        var type = '';
        var subtype = '';
        var name = '';
        var icon = '';
        var stats = [];
        var craft = '';
        var release = '';
        var materialsImg = [];
        var monstersImg = [];
        var materialsTxt = [];
        var monstersTxt = [];
        row.forEach((cell, index) => {
            if (index == 0 && type == '') {
                var cells = cell.split('-');
                type = cells[0].trim();
                if (cells.length > 1) {
                    subtype = cells[1].trim();
                }
            } else if (name == '' && type != '') {
                if (cell.includes('EP')) {
                    release = cell;
                } else {
                    name = cell;
                }
            } else if (name != '' && icon == '' && cell.includes('IMAGE')) {
                icon = cell.split('"')[1];
            } else if (type != '' && name != '' && icon != '' && 
                (!monstersImg.length && !materialsImg.length) &&
                (!cell.includes('Craft') && !cell.includes('IMAGE') && !cell.includes('?'))) {
                cell = cell.substring(1).trim();
                stats.push(cell);
            } else if (cell.includes('Craft')) {
                craft = cell.split(':')[1].trim();
            } else if (cell.includes('IMAGE')) {
                if (cell.includes('monsters') && !monstersImg.length) {
                    monstersImg.push(cell.split('"')[1]);
                } else {
                    materialsImg.push(cell.split('"')[1]);
                }
            } else if (name && icon && !cell.includes('No information') && !cell.includes('?')) {
                if ((/\d/.test(cell) || monstersTxt.length) && materialsImg.length) {
                    materialsTxt.push(cell);
                } else if (monstersImg.length) {
                    monstersTxt.push(cell);
                }
            }
        });
        var dropCraftGear = createDropCrafGear(type, subtype, name, icon, stats, craft, release, materialsImg, monstersImg, materialsTxt, monstersTxt);
        dropCraftGearList.push(dropCraftGear);
    });
    return dropCraftGearList;
}

function createDropCrafGear(type, subtype, name, icon, stats, craft, release, materialsImg, monstersImg, materialsTxt, monstersTxt) {
    var objectMaterials = []
    for (var i = 0; i < materialsImg.length; i++) {
        var material = new dropCraftGear.material(materialsTxt[i], materialsImg[i]);
        objectMaterials.push(material);
    }
    var objectMonsters = []
    for (var i = 0; i < monstersImg.length; i++) {
        var monster = new dropCraftGear.monster(monstersTxt[i], monstersImg[i]);
        objectMonsters.push(monster);
    }
    return new dropCraftGear.dropCraftGear(type, subtype, name, icon, stats, craft, release, objectMaterials, objectMonsters);
}

module.exports = {
    filterDropCraftGearsList: function (rows) {
        rows = filterObjectRow(rows);
        rows = removeTrashFromArray(rows);
        return createDropCraftGearList(rows);
    }
}


