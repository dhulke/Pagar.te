"use strict";

const { TransactionCashInValidator } = require("./TransactionCashInValidator");

const TransactionPaymentMethod = {
    CREDIT_CARD: Symbol(),
    DEBIT_CARD: Symbol()
};


class Transaction {

    constructor(transactionDto = null) {
        if(transactionDto) {
            this.setValue(transactionDto.value);
            this.setDescription(transactionDto.description);
            this.setPaymentMethod(transactionDto.paymentMethod);
            this.setCardNumber(transactionDto.cardNumber);
            this.setCardHolderName(transactionDto.cardHolderName);
            this.setExpirationDate(transactionDto.expirationDate);
            this.setCvv(transactionDto.cvv);
            this.setPayables(transactionDto.payables);
        }
    }

    canCashIn(cashInDto) {
        const cashInValidator = new TransactionCashInValidator(cashInDto);
        return cashInValidator.validate();
    }

    cashIn(cashInDto) {
        if(this.canCashIn(cashInDto).length > 0) {
            throw new Error("Transaction Cash-In Validation Error.")
        }

        this.setValue(cashInDto.value);
        this.setDescription(cashInDto.description);
        this.setPaymentMethod(cashInDto.paymentMethod);
        this.setCardNumber(cashInDto.cardNumber);
        this.setCardHolderName(cashInDto.cardHolderName);
        this.setExpirationDate(cashInDto.expirationDate);
        this.setCvv(cashInDto.cvv);
    }

    setValue(value) {
        this.value = value;
    }

    setDescription(description) {
        this.description = description;
    }

    setPaymentMethod(paymentMethod) {
        this.paymentMethod = TransactionPaymentMethod[paymentMethod];
    }

    setCardNumber(cardNumber) {
        this.cardNumber = cardNumber;
    }

    setCardHolderName(cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = new Date(expirationDate);
    }

    setCvv(cvv) {
        this.cvv = cvv;
    }

    setPayables(payables) {
        this.payables = payables;
    }
}



module.exports = { Transaction, TransactionPaymentMethod };
