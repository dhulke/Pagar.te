class UserId {

    constructor(id) {
        this.set(id);
    }

    get() {
        return this.id;
    }

    set(id) {
        if(isNaN(parseInt(id))) {
            throw new Error("UserId should be a number");
        }
        this.id = id;
    }
}

module.exports = { UserId };
