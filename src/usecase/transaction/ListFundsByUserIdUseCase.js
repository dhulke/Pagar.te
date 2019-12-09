const { UseCaseCommand } = require("../UseCaseCommand");
const { Transaction } = require("../../entity/Transaction");
const { FundsReportService } = require("../../service/FundsReportService");


class ListFundsByUserIdUseCase extends UseCaseCommand {

    constructor(presenter, transactionRepository) {
        super();
        this.presenter = presenter;
        this.transactionRepository = transactionRepository;
    }

    async execute({ userId }) {

        try {
            await this.findTransactionsForGivenUserId(userId);
            this.generateFundsReportDto();
            return this.returnFundsReportDtoToPresenter();
        } catch(error) {//console.log(error)
            return this.returnInternalErrorToPresenter(error.message);
        }

    }

    async findTransactionsForGivenUserId(userId) {
        this.transactions = await this.transactionRepository.findTransactionsByUserId(userId);
    }

    generateFundsReportDto() {
        const fundsReportService = new FundsReportService(this.transactions);
        this.fundsReportDto = fundsReportService.generateFundsReport();
    }

    returnFundsReportDtoToPresenter() {
        return this.presenter.ok(this.fundsReportDto);
    }

    returnInternalErrorToPresenter(message) {
        return this.presenter.internalError(message);
    }
}

module.exports = { ListFundsByUserIdUseCase };
