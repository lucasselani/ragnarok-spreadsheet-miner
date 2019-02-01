module.exports = {
    nameToId: (name) => {
        return name.replace(/[^a-z]/gi, '').trim();
    },

    breakMaterialName: (materialName) => {
        var brokenQuantity;
        var brokenName;

        if (/\s{1}x[0-9]{1,9}/.test(materialName)) {
            brokenQuantity = materialName.substring(materialName.lastIndexOf('x') + 1).trim();
            brokenName = materialName.substring(0, materialName.lastIndexOf('x')).trim();
        } else {
            brokenQuantity = '1';
            brokenName = materialName;
        }
        return {
            name: brokenName,
            quantity: brokenQuantity
        };
    }
}