const { UseCaseCommand } = require("../UseCaseCommand");
const { Transaction } = require("../../entity/Transaction");
const { TransactionAssembler } = require("./TransactionAssembler");


class ListTransactionsUseCase extends UseCaseCommand {

    constructor(presenter, transactionRepository) {
        super();
        this.presenter = presenter;
        this.transactionRepository = transactionRepository;
        this.transactionsDto = [];
    }

    async execute({ userId }) {

        try {
            this.transactions = await this.transactionRepository.findTransactionsByUserId(userId);
            this.mapTransactionsToDto();
            return this.returnOk();
        } catch(error) {//console.log(error)
            return this.returnInternalError(error.message);
        }

    }

    returnOk() {
        return this.presenter.ok(this.transactionsDto);
    }

    mapTransactionsToDto(transactions) {
        const transactionAssembler = new TransactionAssembler;
        for(const transaction of this.transactions) {
            const transactionDto = transactionAssembler.mapTransactionToDto(transaction);
            this.transactionsDto.push(transactionDto);
        }
    }


    returnInternalError(message) {
        return this.presenter.internalError(message);
    }
}

module.exports = { ListTransactionsUseCase };
