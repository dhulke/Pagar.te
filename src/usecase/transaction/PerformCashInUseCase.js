const { UseCaseCommand } = require("../UseCaseCommand");
const { Transaction } = require("../../entity/Transaction");


class PerformCashInUseCase extends UseCaseCommand {

    constructor(presenter, transactionRepository, fundsService) {
        super();
        this.presenter = presenter;
        this.transactionRepository = transactionRepository;
        this.fundsService = fundsService;
    }

    async execute(cashInDto) {

        try {
            if(this.isValid(cashInDto)) {
                const transaction = new Transaction(cashInDto);
                await transaction.cashIn(this.fundsService);
                await this.transactionRepository.add(transaction);
                return this.returnOk();
            }
        } catch(error) {//console.log(error)
            return this.returnInternalError(error.message);
        }

    }

    isValid(cashInDto) {
        const validationErrors = Transaction.canCashIn(cashInDto);
        if(validationErrors.length > 0) {
            this.returnValidationError(validationErrors);
            return false;
        }
        return true;
    }

    returnOk(payload) {
        return this.presenter.ok(payload);
    }

    returnValidationError(message) {
        return this.presenter.validationError(message);
    }

    returnInternalError(message) {
        return this.presenter.internalError(message);
    }
}

module.exports = { PerformCashInUseCase };
