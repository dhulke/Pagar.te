const { Card } = require("../entity/Card");


class FundsService {
    isFundsAvailable(value, card) {
        return true;
    }
}

module.exports = { FundsService };
