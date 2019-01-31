const authSpreadsheet = require('../Auth/AuthSpreadsheet');
const setCombosFilter = require('./SetCombosFilter');

module.exports = {
    getSetComboList: () => {
        return new Promise((resolve, reject) => {
            authSpreadsheet.openSheet().then(result => {
                const sheets = result;
                sheets.spreadsheets.values.get({
                    spreadsheetId: '1Jof-XLzLAd-wXRW6Z1S3sqUuTX7PL0cqEISdQynRiT4',
                    range: 'Equipment%2FGear Set Combo',
                    valueRenderOption: 'Formula'
                }, (err, res) => {
                    if (err) {
                        reject('The API returned an error: ' + err);
                    } else {
                        const rows = res.data.values;
                        if (rows.length) {
                            resolve(setCombosFilter.filterSetCombosList(rows));
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

