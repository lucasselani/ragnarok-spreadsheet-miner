const utils = require('./Utils');

var MATERIALS_PATH = 'materials';
var DROP_CRAFT_GEARS_PATH = {
    item: 'drop_craft_gears/item',
    detail: 'drop_craft_gears/detail'
};
var HEADGEARS_PATH = {
    item: 'headgears/item',
    detail: 'headgears/detail'
};
var UPGRADEABLE_GEARS_PATH = {
    base: {
        item: 'upgradeable_gears/base/item',
        detail: 'upgradeable_gears/base/detail'
    },
    final: {
        item: 'upgradeable_gears/final/item',
        detail: 'upgradeable_gears/final/detail'
    },
    upgrades: 'upgradeable_gears/upgrades'
};

var dropCraftGearsList;
var upgradeableGearsList;
var headgearsList;
var setComboList;

function saveLists(listOfItems) {
    dropCraftGearsList = listOfItems[0];
    upgradeableGearsList = listOfItems[1];
    headgearsList = listOfItems[2];
    setComboList = listOfItems[3];
}

function createComboReferenceStructure(gear) {
    var comboList = [];
    var gearId = utils.nameToId(gear.name);
    setComboList.forEach(combo => {
        var comboFound = false;
        combo.items.forEach(item => {
            var itemId = utils.nameToId(item.name);
            if (itemId == gearId) {
                comboFound = true;
            }
        });

        if (comboFound) {
            var comboStructure = {};
            comboStructure['items'] = {};
            comboStructure['stats'] = combo.stats;

            combo.items.forEach(deepItem => {
                var itemId = utils.nameToId(deepItem.name);
                var found = false;
                comboStructure.items[itemId] = { 
                    name: deepItem.name,
                    icon: deepItem.icon,
                    ref: ''
                };

                for (var i = 0; i < headgearsList.length && !found; i++) {
                    var headgearId = utils.nameToId(headgearsList[i].name);
                    if (headgearId == itemId) {
                        comboStructure.items[itemId].ref = `${HEADGEARS_PATH.detail}/${headgearId}`;
                        found = true;
                        break;
                    }
                }
                for (var i = 0; i < upgradeableGearsList.length && !found; i++) {
                    var baseId = utils.nameToId(upgradeableGearsList[i].base.name);
                    var finalId = utils.nameToId(upgradeableGearsList[i].final.name);
                    if (baseId == itemId) {
                        comboStructure.items[itemId].ref = `${UPGRADEABLE_GEARS_PATH.base.detail}/${baseId}`;
                        found = true;
                        break;
                    } else if (finalId == itemId) {
                        comboStructure.items[itemId].ref = `${UPGRADEABLE_GEARS_PATH.final.detail}/${finalId}`;
                        found = true;
                        break;
                    }
                }
                for (var i = 0; i < dropCraftGearsList.length && !found; i++) {
                    var dropCraftId = utils.nameToId(dropCraftGearsList[i].name);
                    if (dropCraftId == itemId) {
                        comboStructure.items[itemId].ref = `${DROP_CRAFT_GEARS_PATH.detail}/${dropCraftId}`;
                        found = true;
                        break;
                    }
                }
            });

            comboList.push(comboStructure);
        }
    });
    return comboList;
}

function createMaterialsReferenceStructure(materials) {
    var materialsStructure = {};
    materials.forEach(material => {
        var materialObject = {};
        var quantity = material.substring(material.lastIndexOf('x') + 1).trim();
        var name = material.substring(0, material.lastIndexOf('x')).trim();
        var materialId = utils.nameToId(name);

        materialObject['ref'] = `${MATERIALS_PATH}/${materialId}`;
        materialObject['quantity'] = quantity;
        materialsStructure[materialId] = materialObject;
    });

    return materialsStructure;
}

// ITEMS RELATED
function createBaseUpgradeableGearStructure(gear, baseStructure) {
    var base = gear.base;
    var final = gear.final;

    var baseGearId = utils.nameToId(base.name);
    var finalGearId = utils.nameToId(final.name);
    var gearComboStructure = createComboReferenceStructure(base);
    var materialsStructure = createMaterialsReferenceStructure(base.materials);
    baseStructure.detail[baseGearId] = {
        craftLocation: base.craftLocation,
        icon: base.icon,
        level: base.level,
        name: base.name,
        price: base.price,
        release: base.release ? base.release : '',
        stats: base.stats,
        subtype: base.subtype,
        type: base.type,
        upgrades: `${UPGRADEABLE_GEARS_PATH.upgrades}/${baseGearId}`,
        final: `${UPGRADEABLE_GEARS_PATH.final.detail}/${finalGearId}`,
        combo: gearComboStructure,
        materials: materialsStructure
    }

    baseStructure.item[baseGearId] = {
        ref: `${UPGRADEABLE_GEARS_PATH.base.detail}/${baseGearId}`,
        type: base.type,
        subtype: base.subtype,
        icon: base.icon,
        name: base.name
    }
}

function createFinalUpgradeableGearStructure(gear, finalStructure) {
    var base = gear.base;
    var final = gear.final;

    var baseGearId = utils.nameToId(base.name);
    var finalGearId = utils.nameToId(final.name);
    var gearComboStructure = createComboReferenceStructure(final);
    var materialsStructure = createMaterialsReferenceStructure(final.materials);
    finalStructure.detail[finalGearId] = {
        upgradeLocation: final.upgradeLocation,
        icon: final.icon,
        level: final.level,
        name: final.name,
        price: final.price,
        release: final.release ? final.release : '',
        stats: final.stats,
        subtype: base.subtype,
        type: base.type,
        upgrades: `${UPGRADEABLE_GEARS_PATH.upgrades}/${baseGearId}`,
        base: `${UPGRADEABLE_GEARS_PATH.base.detail}/${baseGearId}`,
        combo: gearComboStructure,
        materials: materialsStructure
    }

    finalStructure.item[finalGearId] = {
        ref: `${UPGRADEABLE_GEARS_PATH.final.detail}/${finalGearId}`,
        type: base.type,
        subtype: base.subtype,
        icon: final.icon,
        name: final.name
    }
}

function createUpgradesUpgradeableGearStructure(gear, upgradesStructure) {
    var base = gear.base;  
    var upgrades = gear.upgrades;

    var baseGearId = utils.nameToId(base.name);
    upgradesStructure[baseGearId] = [];
    upgrades.forEach(upgrade => {
        var materialsStructure = createMaterialsReferenceStructure(upgrade.materials);
        var upgradeStructure = {
            level: upgrade.level,
            price: upgrade.price,
            stats: upgrade.stats,
            upgradeLocation: upgrade.upgradeLocation ? upgrade.upgradeLocation : '',
            icon: base.icon,
            materials: materialsStructure
        }
        upgradesStructure[baseGearId].push(upgradeStructure);
    });

}

function createUpgradeableGearStructure() {
    var upgradeableGears = {
        base: {
            detail: {},
            item: {}
        },
        upgrades: {},
        final: {
            detail: {},
            item: {}
        }
    }

    upgradeableGearsList.forEach(gear => {
        createBaseUpgradeableGearStructure(gear, upgradeableGears.base);
        createFinalUpgradeableGearStructure(gear, upgradeableGears.final);
        createUpgradesUpgradeableGearStructure(gear, upgradeableGears.upgrades)
    });

    return upgradeableGears;
}


module.exports = {
    saveAllItems: (listOfItems) => {
        saveLists(listOfItems);
    },

    getAllItemsStructure: (lists) => {
        console.log(lists.length);
    },

    getUpgradeableGearsStructure: () => {
        return createUpgradeableGearStructure();
    },

    getDropCraftGearsStructure: (lists) => {
        console.log(lists.length);
    },

    getHeadgearsStructure: (lists) => {
        console.log(lists.length);
    },

    getMaterialsStructure: (lists) => {
        console.log(lists.length);
    },
}