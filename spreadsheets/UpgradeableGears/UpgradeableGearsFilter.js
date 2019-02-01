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
                        if (/\d|\w|\?/.test(splittedCell) && !splittedCell.includes('*')) {
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

function createUpgradeableGearList(rows) {
    var upgradeableGearList = []
    rows.forEach(row => {
        var step = 'base'
        var base = new upgradeableGear.base();
        var upgrades = [];
        var final = new upgradeableGear.final();
        row.forEach((cell, index) => {
            if (step == 'base') {
                if (cell == 'I') {
                    step = 'I'
                } else {
                    createBaseGear(base, cell, index);
                }
            }

            if (step == 'I') {
                if (cell == 'II') {
                    step = 'II'
                } else {
                    createGearUpgrades(upgrades, final, cell, step);
                }
            }

            if (step == 'II') {
                if (cell == 'III') {
                    step = 'III';
                } else {
                    createGearUpgrades(upgrades, final, cell, step);
                }
            }

            if (step === 'III') {
                if (cell == 'Final') {
                    step = 'Final';
                } else {
                    createGearUpgrades(upgrades, final, cell, step);
                }
            }

            if (step == 'Final') {
                createFinalGear(final, cell, step);
            }
        });
        var upgradeableGearObject = new upgradeableGear.upgradeableGear(base, upgrades, final);
        upgradeableGearList.push(upgradeableGearObject);
    });
    return upgradeableGearList;
}

function createBaseGear(base, cell, index) {
    if (isLevel(cell)) {
        base.level = cell;
    } else if (index == 0 && base.type == '') {
        var values = cell.split('-');
        base.type = values[0].trim();
        if(values.length > 1) {
            base.subtype = values[1].trim();
        }
    } else if (base.type == 'Weapon' && base.subtype == '' && index == 1) {
        base.subtype = cell
    } else if (base.name == '' && cell.includes('EP')) {
        base.release = cell;
    } else if (base.name == '' && base.type != '') {
        base.name = cell;
    } else if (base.name != '' && base.icon == '' && cell.includes('IMAGE')) {
        base.icon = cell.split('"')[1];
    } else if (base.name != '' && base.icon != '' && base.type != '') {
        if (cell.includes('Craft') || cell.includes('Crack')) {
            cell.replace('Crack', 'Craft');
            base.craftLocation = cell.split(':')[1].trim();
        } else if (cell.includes('zeny') || cell.includes('?')) {
            base.price = cell;
        } else if (base.stats.length && isMaterial(cell)) {
            base.materials.push({
                name: cell,
                icon: ''
            });
        } else if (!base.materials.length && isNotDifferentThanStats(cell)) {
            var cells = cell.split(',');
            cells.forEach(value => {
                base.stats.push(value.trim());
            });
        }
    }
}

function createGearUpgrades(upgrades, final, cell, step) {
    if ((step == 'I' || step == 'II' || step == 'III') && cell == step) {
        var newUpgrade = new upgradeableGear.upgrade();
        upgrades.push(newUpgrade);
    }

    if (upgrades.length) {
        var upgrade = upgrades[upgrades.length - 1];
    }

    if (isLevel(cell)) {
        upgrade.level = cell;
    } else if (cell.includes('zeny')) {
        upgrade.price = cell;
    } else if (cell.includes('Upgrade')) {
        upgrade.upgradeLocation = cell.split(':')[1].trim();
    } else if (upgrade.step != '' && !upgrade.stats.length && !upgrade.materials.length && isNotDifferentThanStats(cell)) {
        var cells = cell.split(',');
        cells.forEach(value => {
            upgrade.stats.push(value.trim());
        });
    } else if (upgrade.level == 'II' && upgrade.materials.length && upgrade.price != '') {
        if (cell.includes('IMAGE')) {
            final.icon = cell.split('"')[1].trim();
        } else if (final.name == '') {
            final.name = cell;
        }
    } else if (isMaterial(cell)) {
        upgrade.materials.push({
            name: cell,
            icon: ''
        });
    }
}

function createFinalGear(final, cell) {
    if (isLevel(cell)) {
        final.level = cell;
    } else if (!final.stats.length && !final.materials.length && isNotDifferentThanStats(cell)) {
        var cells = cell.split(',');
        cells.forEach(value => {
            final.stats.push(value.trim());
        });
    } else if (cell.includes('zeny')) {
        final.price = cell;
    } else if (cell.includes("Upgrade")) {
        final.upgradeLocation = cell;
    } else if (isMaterial(cell)) {
        final.materials.push({
            name: cell,
            icon: ''
        });
    }
}

function isLevel(value) {
    return value == "Base" || value == "I" || value == "II" || value == "III" || value == "Final";
}

function isNotDifferentThanStats(value) {
    return !value.includes('Craft') &&
        !value.includes('Crack') &&
        !value.includes('IMAGE') &&
        !value.includes('?') &&
        !value.includes('zeny');
}

function isMaterial(value) {
    return /\s{1}x[0-9]{1,9}/.test(value) &&
        !value.includes(',') &&
        !value.includes('%') &&
        !value.includes('+') &&
        !value.includes('-') &&
        !value.includes('?');
}

module.exports = {
    filterUpgradeableGearsList: function (rows) {
        objectRows = filterObjectRow(rows);
        objectRows = removeTrashFromArray(objectRows);
        return createUpgradeableGearList(objectRows);
    }
}


