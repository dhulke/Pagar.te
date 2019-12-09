"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Presenter } = require("../../../src/usecase/Presenter");
const { TransactionRepository } = require("../../../src/usecase/transaction/TransactionRepository");
const { FundsService } = require("../../../src/service/FundsService");
const { PerformCashInUseCase } = require("../../../src/usecase/transaction/PerformCashInUseCase");


class CashInPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
}

class TestRepository extends TransactionRepository {
    async add(transactionEntity) {}
}

const cashInDto = {
    userId: "1234",
    value: 20.50,
    description: "Smartband XYZ 3.0",
    paymentMethod: "credit_card",
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
};


describe("Perform Cash-In Use Case #unit", () => {

    it("Should present internal error, when not providing user id", async () => {

        const missingValueDto = Object.assign({}, cashInDto);
        missingValueDto.userId = undefined;

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("internalError").once();

        const transactionRepository = new TransactionRepository;
        const mockTransactionRepository = sinon.mock(transactionRepository);
        mockTransactionRepository.expects("add").never();

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository, fundsService);
        await performCashInUseCase.execute(missingValueDto);

        mockCashInPresenter.verify();
        mockTransactionRepository.verify();
    });

    it("Should present validation error, when not providing transaction value", async () => {

        const missingValueDto = Object.assign({}, cashInDto);
        missingValueDto.value = undefined;

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("validationError").once();

        const transactionRepository = new TransactionRepository;
        const mockTransactionRepository = sinon.mock(transactionRepository);
        mockTransactionRepository.expects("add").never();

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository, fundsService);
        await performCashInUseCase.execute(missingValueDto);

        mockCashInPresenter.verify();
        mockTransactionRepository.verify();
    });

    it("Should present ok, when providing proper transaction input", async () => {

        const properDto = Object.assign({}, cashInDto);

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("ok").once();

        const transactionRepository = new TransactionRepository;
        const repositorySpy = sinon.stub(transactionRepository, "add");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        expect(repositorySpy).to.have.been.called;
        mockCashInPresenter.verify();
    });

    it("Should save transaction value greater than payable value", async () => {

        const properDto = Object.assign({}, cashInDto);

        const cashInPresenter = new CashInPresenter;
        const testRepository = new TestRepository;
        sinon.stub(testRepository, "add");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, testRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        const transaction = testRepository.add.getCall(0).args[0];

        expect(transaction.getValue()).to.be.greaterThan(transaction.getPayables()[0].getValue());
    });

    it("Should present internal error, when repository throws error", async () => {

        const properDto = Object.assign({}, cashInDto);

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("internalError").once();

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "add").rejects("Error");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        mockCashInPresenter.verify();
    });

    it("Should present internal error, when funds aren't available", async () => {

        const properDto = Object.assign({}, cashInDto);

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("internalError").once();

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "add").rejects("Error");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(false);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        mockCashInPresenter.verify();
    });

});
