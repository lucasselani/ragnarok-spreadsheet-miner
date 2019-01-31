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
    firebase.database().ref(name).set(items).then((result, err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Push successfully to ${name}`);
        }
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
    var items = firebaseStructurer.getUpgradeableGearsStructure();
    sendToFirebase(items, 'upgradeable_gears_test');
});