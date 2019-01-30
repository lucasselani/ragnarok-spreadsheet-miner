const authSpreadsheet = require('../Auth/AuthSpreadsheet')
const dropCraftGearsFilter = require('./DropCraftGearsFilter')
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAHj68XzwVDpp01MOVPqhF-8EQQ3lyb1c0",
    authDomain: "ragnarok-m-items.firebaseapp.com",
    databaseURL: "https://ragnarok-m-items.firebaseio.com",
    projectId: "ragnarok-m-items",
    storageBucket: "ragnarok-m-items.appspot.com",
    messagingSenderId: "571563505421"
};

firebase.initializeApp(config);

authSpreadsheet.openSheet().then(function (result) {
    const sheets = result;
    sheets.spreadsheets.values.get({
        spreadsheetId: '1Jof-XLzLAd-wXRW6Z1S3sqUuTX7PL0cqEISdQynRiT4',
        range: 'Drop & Craft Gears',
        valueRenderOption: 'Formula'
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            var dropCraftGearsList = dropCraftGearsFilter.filterDropCraftGearsList(rows);
            firebase.database().ref('drop_craft_gears').set(dropCraftGearsList).then((result, err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Push successfully: ${result}`);
                }
            });
        } else {
            console.log('No data found.');
        }
    });
}, function (err) {
    console.log(err);
});