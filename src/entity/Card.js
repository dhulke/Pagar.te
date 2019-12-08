class Card {

    constructor(cardNumber, cardHolderName, expirationDate, cvv) {
        this.setCardNumber(cardNumber);
        this.setCardHolderName(cardHolderName);
        this.setExpirationDate(expirationDate);
        this.setCvv(cvv);
    }

    getCardNumber() {
        return this.cardNumber;
    }

    setCardNumber(cardNumber) {
        this.cardNumber = cardNumber;
        this.setSafeCardNumber();
    }

    getSafeCardNumber() {
        return this.safeCardNumber;
    }

    setSafeCardNumber() {
        const trimmed = this.cardNumber.trim();
        this.safeCreditCardNumber = trimmed.length > 4 ? trimmed.slice(-4) : trimmed;
    }

    getCardHolderName() {
        return this.cardHolderName;
    }

    setCardHolderName(cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    getExpirationDate() {
        return this.expirationDate;
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = new Date(expirationDate);
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
