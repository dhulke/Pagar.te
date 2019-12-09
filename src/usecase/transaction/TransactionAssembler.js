const { TransactionPaymentMethod } = require("../../entity/Transaction");

class TransactionAssembler {

    mapTransactionToDto(transaction) {
        const transactionDto = {};
        transactionDto.userId = transaction.getUserId().get();
        transactionDto.value = transaction.getValue();
        transactionDto.description = transaction.getDescription();
        transactionDto.paymentMethod = this.mapPaymentMethod(transaction.getPaymentMethod());
        return transactionDto;
    }

    mapPaymentMethod(paymentMethod) {
        return {
            [TransactionPaymentMethod.CREDIT_CARD]: "credit_card",
            [TransactionPaymentMethod.DEBIT_CARD]: "debit_card"
        }[paymentMethod];
    }
}

module.exports = { TransactionAssembler };
