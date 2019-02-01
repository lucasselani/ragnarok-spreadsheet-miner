const dropCraftGears = require('../DropCraftGears/DropCraftGearsController');
const upgradeableGears = require('../UpgradeableGears/UpgradeableGearsController');
const headgears = require('../Headgears/HeadgearsController');
const setCombo = require('../SetCombos/SetCombosController');
const firebaseStructurer = require('./FirebaseStructurer');

var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAHj68XzwVDpp01MOVPqhF-8EQQ3lyb1c0",
    authDomain: "ragnarok-m-items.firebaseapp.com",
    databaseURL: "https://ragnarok-m-items.firebaseio.com",
    projectId: "ragnarok-m-items",
    storageBucket: "ragnarok-m-items.appspot.com",
    messagingSenderId: "571563505421"
};

function sendToFirebase(items, name) {
    return new Promise((resolve, reject) => {
        firebase.database().ref(name).set(items).then((result, err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`Push successfully to ${name}`);
            }
        });
    });
}

firebase.initializeApp(config);
Promise.all([
    dropCraftGears.getDropCraftGearsList(),
    upgradeableGears.getUpgradeableGearsList(),
    headgears.getHeadgearList(),
    setCombo.getSetComboList()
]).then((listOfItems) => {
    firebaseStructurer.saveAllItems(listOfItems);

    var upgradeableGearsStructure = firebaseStructurer.getUpgradeableGearsStructure();    
    var dropCraftGearsStructure = firebaseStructurer.getDropCraftGearsStructure();
    var headgearsStructure = firebaseStructurer.getHeadgearsStructure();
    var materialsStructure = firebaseStructurer.getMaterialsStructure();
    var allItemsStructure = firebaseStructurer.getAllItemsStructure(dropCraftGearsStructure, headgearsStructure, upgradeableGearsStructure);

    Promise.all([
        sendToFirebase(upgradeableGearsStructure, 'upgradeable_gears'),
        sendToFirebase(dropCraftGearsStructure, 'drop_craft_gears'),
        sendToFirebase(headgearsStructure, 'headgears'),
        sendToFirebase(materialsStructure, 'materials'),
        sendToFirebase(allItemsStructure, 'all_items')
    ]).then(result => {
        result.forEach(answer => {
            console.log(answer);
        });
    });
});