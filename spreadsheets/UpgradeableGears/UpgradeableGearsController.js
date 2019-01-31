const authSpreadsheet = require('../Auth/AuthSpreadsheet');
const upgradeableGearsFilter = require('./UpgradeableGearsFilter');

module.exports = {
    getUpgradeableGearsList: () => {
        return new Promise((resolve, reject) => {
            authSpreadsheet.openSheet().then(result => {
                const sheets = result;
                sheets.spreadsheets.values.get({
                    spreadsheetId: '1Jof-XLzLAd-wXRW6Z1S3sqUuTX7PL0cqEISdQynRiT4',
                    range: 'Upgradeable Gears',
                    valueRenderOption: 'Formula'
                }, (err, res) => {
                    if (err) {
                        reject('The API returned an error: ' + err);
                    } else {
                        const rows = res.data.values;
                        if (rows.length) {
                            resolve(upgradeableGearsFilter.filterUpgradeableGearsList(rows));
                        } else {
                            reject('No data found.');
                        }
                    }
                });
            }, err => {
                reject(err);
            });
        });
    }
}
