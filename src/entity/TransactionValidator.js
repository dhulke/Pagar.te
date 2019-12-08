"use strict";

const { InvalidFieldsDto } = require("./InvalidFieldsDto");


class TransactionValidator {

    constructor(cashInDto) {
        this.cashInDto = cashInDto;
        this.invalidFields = [];
    }

    getInvalidFields() {
        return this.invalidFields;
    }

    validate() {
        this.validateMissingFields();
        this.validateCardNumber();
        this.validateCvv();
        this.validatePaymentMethod();
        return this.invalidFields;
    }

    validateMissingFields() {
        const missingFields = [];

        if(!this.cashInDto.value)
            missingFields.push("value");
        if(!this.cashInDto.description)
            missingFields.push("description");
        if(!this.cashInDto.paymentMethod)
            missingFields.push("paymentMethod");
        if(!this.cashInDto.cardNumber)
            missingFields.push("cardNumber");
        if(!this.cashInDto.cardHolderName)
            missingFields.push("cardHolderName");
        if(!this.cashInDto.expirationDate)
            missingFields.push("expirationDate");
        if(!this.cashInDto.cvv)
            missingFields.push("cvv");

        if(missingFields.length > 0) {
            missingFields.forEach(this.missingFieldError.bind(this));
            return false;
        }
        return true;
    }

    validateCardNumber() {
        const cardNumber = this.cashInDto.cardNumber;
        if(!this.isDigits(cardNumber)) {
            this.invalidError("cardNumber", `The cardNumber field should only contain digits. Found: ${cardNumber}`);
            return false;
        }
        return true;
    }

    validateCvv() {
        const cvv = this.cashInDto.cvv;
        if(!this.isDigits(cvv)) {
            this.invalidError("cvv", `The cvv field should only contain digits. Found: ${cvv}`);
            return false;
        }
        if(cvv.length > 3) {
            this.invalidError("cvv", `The cvv field should only contain 3 digits. Found: ${cvv}`);
            return false;
        }
        return true;
    }

    validatePaymentMethod() {
        if(typeof this.cashInDto.paymentMethod === "string") {
            const paymentMethod = this.cashInDto.paymentMethod.toUpperCase();
            return paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD";
        }
        return false;
    }

    isDigits(field) {
        if(Number.isInteger(field))
            return true;
        else if(!field) {
            return false;
        }
        const noSpaces = field.replace(/\s/g, "");
        return !isNaN(parseInt(noSpaces));
    }

    missingFieldError(field) {
        this.invalidError(field, `Field ${field} is either missing or unset`);
    }
    
    invalidError(field, message) {
        this.invalidFields.push(new InvalidFieldsDto(field, message));
    }
}

module.exports = { TransactionValidator };
