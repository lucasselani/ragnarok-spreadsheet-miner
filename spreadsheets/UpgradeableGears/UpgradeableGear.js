module.exports = {
    upgradeableGear: function(base, upgrades, final) {
        this.base = base;
        this.upgrades = upgrades;
        this.final = final;
    },

    upgrade: function(level) {
        this.level = level;
        this.stats = [];
        this.price = '';
        this.materials = [];
        this.upgradeLocation = '';
    },

    final: function(level) {
        this.name = '';
        this.icon = '';
        this.stats = [];
        this.materials = [];
        this.price = '';
        this.upgradeLocation = '';
        this.level = level;
    },

    base: function(level) {
        this.type = '';
        this.subtype = '';
        this.name = '';
        this.icon = '';
        this.stats = [];
        this.craftLocation = '';
        this.release = '';
        this.materials = [];
        this.price = '';
        this.level = level;
    }
}