var headgear = require('./headgear');

function filterObjectRow(rows) {
    var firstLine = true;
    var objectCounter = 0;
    var objectRow = [];
    var previousRow;
    rows.forEach((row) => {
        if (row.length) {
            if (!firstLine) {
                objectCounter++;
                if (objectCounter != 2) {
                    previousRow = row;
                } else {
                    var finalRow = previousRow.concat(row);
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

function createHeadgearList(rows) {
    var headgearList = []
    rows.forEach(row => {
        var name = '';
        var icon = '';
        var stats = [];
        var craft = '';
        var achiev = '';
        var materialsImg = [];
        var monstersImg = [];
        var materialsTxt = [];
        var monstersTxt = [];
        row.forEach((cell, index) => {
            if (index == 0 && name == '') {
                name = cell;
            } else if (name != '' && icon == '' && cell.includes('IMAGE')) {
                icon = cell.split('"')[1];
            } else if (name != '' && icon != '' && craft == '' && achiev == '' &&
                (!monstersImg.length && !materialsImg.length) &&
                (!cell.includes('Craft') && (!cell.includes('IMAGE')))) {
                stats.push(cell);
            } else if (cell.includes('Craft')) {
                craft = cell.split(':')[1].trim();
            } else if (cell.includes('Achievement')) {
                achiev = cell;
            } else if (cell.includes('IMAGE')) {
                if (cell.includes('monsters') && !monstersImg.length) {
                    monstersImg.push(cell.split('"')[1]);
                } else {
                    materialsImg.push(cell.split('"')[1]);
                }
            } else if (name && icon && !cell.includes('No information')) {
                if ((/\d/.test(cell) || monstersTxt.length) && materialsImg.length) {
                    materialsTxt.push(cell);
                } else if (monstersImg.length) {
                    monstersTxt.push(cell);
                }
            }
        });
        var headgear = createHeadgear(name, icon, stats, craft, achiev, materialsImg, monstersImg, materialsTxt, monstersTxt);
        headgearList.push(headgear);
    });
    return headgearList;
}

function createHeadgear(name, icon, stats, craft, achiev, materialsImg, monstersImg, materialsTxt, monstersTxt) {
    var objectMaterials = []
    for (var i = 0; i < materialsImg.length; i++) {
        var material = new headgear.material(materialsTxt[i], materialsImg[i]);
        objectMaterials.push(material);
    }
    var objectMonsters = []
    for (var i = 0; i < monstersImg.length; i++) {
        var monster = new headgear.monster(monstersTxt[i], monstersImg[i]);
        objectMonsters.push(monster);
    }
    return new headgear.headgear(name, icon, stats, craft, achiev, objectMaterials, objectMonsters);
}

module.exports = {
    filterHeadgearList: function (rows) {
        rows = filterObjectRow(rows);
        rows = removeTrashFromArray(rows);
        return createHeadgearList(rows);
    }
}


