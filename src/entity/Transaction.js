"use strict";

const { UserId } = require("./UserId");
const { Card } = require("./Card");
const { Payable } = require("./Payable");
const { CreditCardPayable } = require("./CreditCardPayable");
const { DebitCardPayable } = require("./DebitCardPayable");
const { TransactionValidator } = require("./TransactionValidator");

const TransactionPaymentMethod = {
    CREDIT_CARD: Symbol(),
    DEBIT_CARD: Symbol()
};


class Transaction {

    constructor({userId, value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv, date, payables = []}) {
        if(this.constructor.canCashIn({value, description, paymentMethod, cardNumber, cardHolderName, expirationDate, cvv}).length > 0) {
            throw new Error("Transaction Validation Error.")
        }

        this.setUserId(userId);
        this.setValue(value);
        this.setDescription(description);
        this.setPaymentMethod(paymentMethod);
        this.setCard(cardNumber, cardHolderName, expirationDate, cvv);
        this.setDate(date);
        this.setPayables(payables);
        this.setInstallments(1);
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

    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = new UserId(userId);
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = parseFloat(value);//I know
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getPaymentMethod() {
        return this.paymentMethod;
    }

    setPaymentMethod(paymentMethod) {
        const upper = paymentMethod.toUpperCase();
        this.paymentMethod = TransactionPaymentMethod[upper];
    }

    getCard() {
        return this.card;
    }

    setCard(cardNumber, cardHolderName, expirationDate, cvv) {
        this.card = new Card(cardNumber, cardHolderName, expirationDate, cvv);
    }

    setInstallments(installments) {
        this.installments = installments;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date ? new Date(date * 1000) : new Date();
    }

    getPayables() {
        return this.payables;
    }

    setPayables(payables) {
        this.payables = [];
        for(const {value, date, status} of payables) {
            const dateObj = new Date(date * 1000);
            const payable = new Payable(value, dateObj, status);
            this.payables.push(payable);
        }
    }
}



module.exports = { Transaction, TransactionPaymentMethod };
