const { Payable, PayableStatus } = require("./Payable");

const FEE = 0.05;


class CreditCardPayable extends Payable {

    constructor(value, transactionDate) {
        super(value, transactionDate, "WAITING_FUNDS");
    }

    scheduleAndApplyFee() {
        this.schedule();
        this.applyFee();
    }

    schedule() {
        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
        const tDate = new Date(this.date);
        this.date = new Date(tDate.getTime() + THIRTY_DAYS);
    }

    applyFee() {
        this.value = this.value * (1 - FEE);
    }
}

module.exports = { CreditCardPayable };
