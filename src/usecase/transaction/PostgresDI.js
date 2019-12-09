const { ListFundsByUserIdUseCase } = require("./ListFundsByUserIdUseCase");
const { ListTransactionsByUserIdUseCase } = require("./ListTransactionsByUserIdUseCase");
const { PerformCashInUseCase } = require("./PerformCashInUseCase");
const { PostgresTransactionRepository } = require("./PostgresTransactionRepository");

const { FundsService } = require("../../service/FundsService");

const knexConfig = require("../../../db/postgres/knexfile");


class PostgresDI {

    constructor(env = "development") {
        this.knex = require('knex')(knexConfig[env]);
    }

    shutdown() {
        return this.knex.destroy();
    }

    listFundsByUserIdUseCase(presenter) {
        const repository = new PostgresTransactionRepository(this.knex);
        const useCase = new ListFundsByUserIdUseCase(presenter, repository);
        return useCase;
    }

    listTransactionsByUserIdUseCase(presenter) {
        const repository = new PostgresTransactionRepository(this.knex);
        const useCase = new ListTransactionsByUserIdUseCase(presenter, repository);
        return useCase;
    }

    performCashInUseCase(presenter) {
        const repository = new PostgresTransactionRepository(this.knex);
        const fundsService = new FundsService;
        const useCase = new PerformCashInUseCase(presenter, repository, fundsService)
        return useCase;
    }
}

module.exports = { PostgresDI };
