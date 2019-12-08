class PerformCashInUseCaseDto {
    constructor({value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv}) {
        this.value = value;
        this.description = description;
        this.paymentMethod = paymentMethod;
        this.cardNumber = cardNumber;
        this.cardHolderName = cardHolderName;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
    }
}

module.exports = { PerformCashInUseCaseDto };
