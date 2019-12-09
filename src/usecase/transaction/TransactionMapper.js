const { TransactionPaymentMethod } = require("../../entity/Transaction");
const { PayableStatus } = require("../../entity/Payable");

class TransactionMapper {

    mapTransactionToDto(transaction) {
        const transactionDto = {};
        transactionDto.value = transaction.getValue();
        transactionDto.description = transaction.getDescription();
        transactionDto.paymentMethod = this.paymentMethodToDto(transaction.getPaymentMethod());
        return transactionDto;
    }

    toPersistenceDto(entity) {
        const dto = {};
        dto.userId = entity.getUserId().get();
        dto.value = entity.getValue();
        dto.description = entity.getDescription();
        dto.paymentMethod = this.paymentMethodToDto(entity.getPaymentMethod());
        dto.cardNumber = entity.getCard().get
    }

    paymentMethodToDto(paymentMethod) {
        return {
            [TransactionPaymentMethod.CREDIT_CARD]: "credit_card",
            [TransactionPaymentMethod.DEBIT_CARD]: "debit_card"
        }[paymentMethod];
    }

    payableStatusToDto(payableStatus) {
        return {
            [PayableStatus.WAITING_FUNDS]: "waiting_funds",
            [PayableStatus.PAID]: "paid"
        }[payableStatus];
    }
}

module.exports = { TransactionMapper };
