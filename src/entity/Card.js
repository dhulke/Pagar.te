class Card {

    constructor(number, holderName, expirationDate, cvv) {
        this.setNumber(number);
        this.setHolderName(holderName);
        this.setExpirationDate(expirationDate);
        this.setCvv(cvv);
    }

    getNumber() {
        return this.number;
    }

    setNumber(cardNumber) {
        this.number = cardNumber;
        this.setSafeNumber();
    }

    getSafeNumber() {
        return this.safeNumber;
    }

    setSafeNumber() {
        const trimmed = this.number.trim();
        this.safeNumber = trimmed.length > 4 ? trimmed.slice(-4) : trimmed;
    }

    getHolderName() {
        return this.holderName;
    }

    setHolderName(cardHolderName) {
        this.holderName = cardHolderName;
    }

    getExpirationDate() {
        return this.expirationDate;
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = expirationDate;
    }

    getCvv() {
        return this.cvv;
    }

    setCvv(cvv) {
        this.cvv = new String(cvv);
        this.setSafeCvv();
    }

    getSafeCvv() {
        return this.safeCvv;
    }

    setSafeCvv() {
        this.safeCvv = this.cvv.trim().replace(/./g, "X");
    }

}

module.exports = { Card };
