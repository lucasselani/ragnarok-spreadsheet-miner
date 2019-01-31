module.exports = {
    nameToId: (name) => {
        return name.replace(/[^a-z]/gi, '').trim();
    }
}