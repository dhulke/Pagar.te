"use strict";

const { Card } = require("./Card");
const { CreditCardPayable } = require("./CreditCardPayable");
const { DebitCardPayable } = require("./DebitCardPayable");
const { TransactionValidator } = require("./TransactionValidator");

const TransactionPaymentMethod = {
    CREDIT_CARD: Symbol(),
    DEBIT_CARD: Symbol()
};


class Transaction {

    constructor({value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv, payables = []}) {
        if(this.constructor.canCashIn({value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv}).length > 0) {
            throw new Error("Transaction Validation Error.")
        }

        this.setValue(value);
        this.setDescription(description);
        this.setPaymentMethod(paymentMethod);
        this.setCard(cardNumber, cardHolderName, expirationDate, cvv);
        this.setPayables(payables);
        this.setInstallments(1);
        this.setDate();
    }

    static canCashIn({value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv}) {
        const cashInDto = {value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv};
        const validator = new TransactionValidator(cashInDto);
        return validator.validate();
    }

    async cashIn(fundsService) {
        if(!await fundsService.isFundsAvailable(this.value, this.card)) {
            throw new Error("Insuficient funds");
        }

        this.createPayables();
    }

    createPayables() {
        if(this.payables.length > 0) {
            throw new Error("You cannot Cash-In on an already Cashed-In transaction");
        }

        switch(this.paymentMethod) {
            case TransactionPaymentMethod.CREDIT_CARD: return this.createCreditCardPayables();
            case TransactionPaymentMethod.DEBIT_CARD: return this.createDebitCardPayable();
        }
    }

    createCreditCardPayables() {
        const installmentsValue = this.value / this.installments; //I know
        for(let i = 0; i < this.installments; i++) {
            const payable = new CreditCardPayable(installmentsValue, this.date);
            payable.scheduleAndApplyFee();
            this.payables.push(payable);
        }
    }

    createDebitCardPayable() {
        const payable = new DebitCardPayable(this.value, this.date);
        payable.scheduleAndApplyFee();
        this.payables.push(payable);
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

    setCard(cardNumber, cardHolderName, expirationDate, cvv) {
        this.card = new Card(cardNumber, cardHolderName, expirationDate, cvv);
    }

    setInstallments(installments) {
        this.installments = installments;
    }

    setDate() {
        this.date = new Date;
    }

    setPayables(payables) {
        this.payables = payables;
    }
}



module.exports = { Transaction, TransactionPaymentMethod };
