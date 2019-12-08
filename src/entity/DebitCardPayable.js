const { Payable, PayableStatus } = require("./Payable");

const FEE = 0.03;


class DebitCardPayable extends Payable {

    constructor(value, transactionDate) {
        super(value, transactionDate, "PAID");
    }

    scheduleAndApplyFee() {
        this.applyFee();
    }

    applyFee() {
        this.value = value * (1 - FEE);
    }
}

module.exports = { DebitCardPayable };
