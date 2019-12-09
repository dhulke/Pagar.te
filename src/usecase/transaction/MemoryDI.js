const { ListFundsByUserIdUseCase } = require("./ListFundsByUserIdUseCase");
const { ListTransactionsByUserIdUseCase } = require("./ListTransactionsByUserIdUseCase");
const { PerformCashInUseCase } = require("./PerformCashInUseCase");
const { MemoryTransactionRepository } = require("./MemoryTransactionRepository");

const { FundsService } = require("../../service/FundsService");


class MemoryDI {

    listFundsByUserIdUseCase(presenter) {
        const memoryRepository = new MemoryTransactionRepository;
        const useCase = new ListFundsByUserIdUseCase(presenter, memoryRepository);
        return useCase;
    }

    listTransactionsByUserIdUseCase(presenter) {
        const memoryRepository = new MemoryTransactionRepository;
        const useCase = new ListTransactionsByUserIdUseCase(presenter, memoryRepository);
        return useCase;
    }

    performCashInUseCase(presenter) {
        const memoryRepository = new MemoryTransactionRepository;
        const fundsService = new FundsService;
        const useCase = new PerformCashInUseCase(presenter, memoryRepository, fundsService)
        return useCase;
    }
}
