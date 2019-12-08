const PayableStatus = {
    PAID: Symbol(),
    WAITING_FUNDS: Symbol()
};

class Payable {
    constructor(value, date, status) {
        this.value = value;
        this.date = date;
        this.status = status;
    }

    setValue(value) {
        this.value = parseFloat(value); //I know
    }

    setDate(date) {
        this.date = new Date(date);
    }

    setStatus(status) {
        this.status = PayableStatus[status];
    }
}

module.exports = { Payable, PayableStatus };
