module.exports = {
    dropCraftGear: function(type, subtype, name, icon, stats, craftLocation, release, materials, monsters) {
        this.type = type;
        this.subtype = subtype;
        this.name = name;
        this.icon = icon;
        this.stats = stats;
        this.craftLocation = craftLocation;
        this.release = release;
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