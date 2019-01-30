function filterObjectRow(rows) {
    var firstLine = true;
    var objectCounter = 0;
    var objectRow = [];
    var previousRow;
    rows.forEach((row) => {
        if (row.length) {
            objectCounter++;
            if (objectCounter != 2) {
                previousRow = row;
            } else {
                var finalRow = previousRow.concat(row);
                objectRow.push(finalRow);
                objectCounter = 0;
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

function createSetComboList(rows) {
    var setComboList = [];
    rows.forEach(row => {
        var setCombo = {
            items: [],
            stats: [],
            icons: []
        };
        row.forEach(cell => {
            if(cell.includes('IMAGE')) {
                setCombo.icons.push(cell.split('"')[1].trim());
            } else {
                if(setCombo.icons.length) {
                    setCombo.items.push(cell);
                } else {
                    setCombo.stats.push(cell);
                }
            }
        });
        setComboList.push(setCombo);
    });
    return setComboList;
}

module.exports = {
    filterSetCombosList: function (rows) {
        rows = filterObjectRow(rows);
        rows = removeTrashFromArray(rows);
        return createSetComboList(rows);
    }
}