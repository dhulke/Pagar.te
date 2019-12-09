const PayableStatus = {
    PAID: Symbol(),
    WAITING_FUNDS: Symbol()
};

class Payable {
    constructor(value, date, status) {
        this.setValue(value);
        this.setDate(date);
        this.setStatus(status);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = parseFloat(value); //I know
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = new Date(date);
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = PayableStatus[status];
    }
}

module.exports = { Payable, PayableStatus };
