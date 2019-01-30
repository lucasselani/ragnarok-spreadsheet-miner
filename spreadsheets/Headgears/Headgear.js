module.exports = {
    headgear: function(name, icon, stats, craftLocation, achievment, materials, monsters) {
        this.name = name;
        this.icon = icon;
        this.stats = stats;
        this.craftLocation = craftLocation;
        this.achievment = achievment;
        this.materials = materials;
        this.monsters = monsters;
    },

    material: function(name, image) {
        this.name = name;
        this.image = image;
    },

    monster: function(name, image) {
        this.name = name;
        this.image = image;
    }
}