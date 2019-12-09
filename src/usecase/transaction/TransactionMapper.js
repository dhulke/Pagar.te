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
        dto.cardNumber = entity.getCard().getSafeNumber();
        dto.cardHolderName = entity.getCard().getHolderName();
        dto.expirationDate = entity.getCard().getExpirationDate();
        dto.cvv = entity.getCard().getSafeCvv();
        dto.payables = this.payablesToDto(entity.getPayables());
        dto.date = this.dateToTimestamp(entity.getDate());
        return dto;
    }

    paymentMethodToDto(paymentMethod) {
        return {
            [TransactionPaymentMethod.CREDIT_CARD]: "credit_card",
            [TransactionPaymentMethod.DEBIT_CARD]: "debit_card"
        }[paymentMethod];
    }

    payablesToDto(payables) {
        const payablesDto = [];
        for(const payable of payables) {
            const payableDto = {};
            payableDto.value = payable.getValue();
            payableDto.date = this.dateToTimestamp(payable.getDate());
            payableDto.status = this.payableStatusToDto(payable.getStatus());
            payablesDto.push(payableDto);
        }
        return payablesDto;
    }

    dateToTimestamp(date) {
        return date.getTime() / 1000;
    }

    payableStatusToDto(payableStatus) {
        return {
            [PayableStatus.WAITING_FUNDS]: "waiting_funds",
            [PayableStatus.PAID]: "paid"
        }[payableStatus];
    }
}

module.exports = { TransactionMapper };
