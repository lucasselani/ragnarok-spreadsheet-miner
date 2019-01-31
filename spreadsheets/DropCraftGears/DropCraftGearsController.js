const authSpreadsheet = require('../Auth/AuthSpreadsheet')
const dropCraftGearsFilter = require('./DropCraftGearsFilter')

module.exports = {
    getDropCraftGearsList: () => {
        return new Promise((resolve, reject) => {
            authSpreadsheet.openSheet().then(function (sheets) {
                sheets.spreadsheets.values.get({
                    spreadsheetId: '1Jof-XLzLAd-wXRW6Z1S3sqUuTX7PL0cqEISdQynRiT4',
                    range: 'Drop & Craft Gears',
                    valueRenderOption: 'Formula'
                }, (err, res) => {
                    if (err) {
                        reject('The API returned an error: ' + err);
                    } else {
                        const rows = res.data.values;
                        if (rows.length) {
                            resolve(dropCraftGearsFilter.filterDropCraftGearsList(rows));
                        } else {
                            reject('No data found.');
                        }
                    }
                });
            }, function (err) {
                console.log(err);
                reject('err');
            });
        });
    }
}
