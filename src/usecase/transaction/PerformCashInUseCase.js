const { UseCaseCommand } = require("../UseCaseCommand");
const { Transaction } = require("../../entity/Transaction");


class PerformCashInUseCase extends UseCaseCommand {

    constructor(presenter, transactionRepository) {
        super();
        this.presenter = presenter;
        this.transactionRepository = transactionRepository;
    }

    async execute(cashInDto) {

        try {
            const transaction = new Transaction;

            const validationErrors = transaction.canCashIn(cashInDto);
            if(validationErrors.length > 0) {
                return this.presenter.validationError(validationErrors);
            }

            transaction.cashIn(cashInDto);
            await this.transactionRepository.add(transaction);
            return this.presenter.ok();

        } catch(error) {
            return this.presenter.internalError(error.message);
        }

    }
}

module.exports = { PerformCashInUseCase };
