var upgradeableGear = require('./UpgradeableGear');

function filterObjectRow(rows) {
    var firstLine = true;
    var firstValue = true;
    var arrayCounter = 0;
    var objectRow = {};
    rows.forEach((row) => {
        if (row.length) {
            if (firstLine) {
                row.forEach(cell => {
                    if (cell.includes('Weapon')) {
                        firstLine = false;
                    }
                });
            }

            if (!firstLine) {
                if (firstValue) {
                    objectRow[arrayCounter] = [];
                    firstValue = false;
                }
                objectRow[arrayCounter].push(row);
                row.forEach(cell => {
                    if (cell.includes('Final')) {
                        if (!firstValue) arrayCounter++;
                        firstValue = true;
                    }
                })
            }
        }
    });
    return objectRow;
}

function removeTrashFromArray(objectRows) {
    var newObject = [];
    for (var index = 0; index < Object.keys(objectRows).length; index++) {
        var newRows = [];
        var rows = objectRows[index];
        rows.forEach((row) => {
            row.forEach((cell) => {
                if (cell.length) {
                    cells = cell.split('\n');
                    cells.forEach((splittedCell) => {
                        splittedCell.replace(/(\r\n|\n|\r)/gm, "");
                        if (/\d|\w/.test(splittedCell) && !splittedCell.includes('*')) {
                            newRows.push(splittedCell);
                        }
                    })
                }
            });
        });
        newObject.push(newRows);
    }
    return newObject;
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
    filterUpgradeableGearsList: function (rows) {
        objectRows = filterObjectRow(rows);
        objectRows = removeTrashFromArray(objectRows);
        console.log(objectRows);
        //return createDropCraftGearList(rows);
    }
}


