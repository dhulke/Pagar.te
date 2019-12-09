"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Transaction } = require("../../../../src/entity/Transaction");
const { MemoryTransactionRepository } = require("../../../../src/usecase/transaction/MemoryTransactionRepository");
const { TransactionMapper } = require("../../../../src/usecase/transaction/TransactionMapper");
const { FundsService } = require("../../../../src/service/FundsService");


const cashInDto = () => ({
    userId: "1234",
    value: 100,
    description: "Smartband XYZ 3.0",
    paymentMethod: "credit_card",
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
});


describe("MemoryTransactionRepository #class", () => {

    it("Should store and retrieve a cashed in transaction with the same instance", async () => {
        MemoryTransactionRepository.clearDatabase()

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const cashInDto1 = cashInDto();
        const transaction = new Transaction(cashInDto1);
        await transaction.cashIn(fundsService);

        const repository = new MemoryTransactionRepository;
        await repository.add(transaction);
        const storedTransaction = await repository.findTransactionsByUserId(cashInDto1.userId);

        const transactionMapper = new TransactionMapper;
        const originalTransactionDto = transactionMapper.toPersistenceDto(transaction);
        const storedTransactionDto = transactionMapper.toPersistenceDto(storedTransaction[0]);

        expect(storedTransactionDto).to.deep.equal(originalTransactionDto);
    });

    it("Should store and retrieve a cashed in transaction with different instances", async () => {
        MemoryTransactionRepository.clearDatabase();

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const cashInDto1 = cashInDto();
        const transaction = new Transaction(cashInDto1);
        await transaction.cashIn(fundsService);

        const repository1 = new MemoryTransactionRepository;
        await repository1.add(transaction);

        const repository2 = new MemoryTransactionRepository;
        const storedTransaction = await repository2.findTransactionsByUserId(cashInDto1.userId);

        const transactionMapper = new TransactionMapper;
        const originalTransactionDto = transactionMapper.toPersistenceDto(transaction);
        const storedTransactionDto = transactionMapper.toPersistenceDto(storedTransaction[0]);

        expect(storedTransactionDto).to.deep.equal(originalTransactionDto);
    });

});
