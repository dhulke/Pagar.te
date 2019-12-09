const { UseCaseCommand } = require("../UseCaseCommand");
const { Transaction } = require("../../entity/Transaction");
const { TransactionMapper } = require("./TransactionMapper");


class ListTransactionsByUserIdUseCase extends UseCaseCommand {

    constructor(presenter, transactionRepository) {
        super();
        this.presenter = presenter;
        this.transactionRepository = transactionRepository;
        this.transactionsDto = [];
    }

    async execute({ userId }) {

        try {
            await this.findTransactionsForGivenUserId(userId);
            this.mapTransactionsToDto();
            return this.returnTransactionsDtoToPresenter();
        } catch(error) {
            return this.returnInternalErrorToPresenter(error.message);
        }

    }

    async findTransactionsForGivenUserId(userId) {
        this.transactions = await this.transactionRepository.findTransactionsByUserId(userId);
    }

    returnTransactionsDtoToPresenter() {
        return this.presenter.ok(this.transactionsDto);
    }

    mapTransactionsToDto(transactions) {
        const transactionAssembler = new TransactionMapper;
        for(const transaction of this.transactions) {
            const transactionDto = transactionAssembler.mapTransactionToDto(transaction);
            this.transactionsDto.push(transactionDto);
        }
    }

    returnInternalErrorToPresenter(message) {
        return this.presenter.internalError(message);
    }
}

module.exports = { ListTransactionsByUserIdUseCase };
