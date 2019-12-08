"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { PerformCashInUseCaseDto } = require("../../../src/usecase/transaction/PerformCashInUseCaseDto");
const { Presenter } = require("../../../src/usecase/Presenter");
const { TransactionRepository } = require("../../../src/usecase/transaction/TransactionRepository");
const { PerformCashInUseCase } = require("../../../src/usecase/transaction/PerformCashInUseCase");


class CashInPresenter extends Presenter {}

const cashInDto = {
    value: 20.50,
    description: "Smartband XYZ 3.0",
    paymentMethod: "credit_card",
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
};


describe("Perform Cash-In Use Case", () => {

    it("Should present validation error, when not providing transaction value", async () => {

        const missingValueDto = new PerformCashInUseCaseDto(cashInDto);
        missingValueDto.value = undefined;

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("validationError").once();

        const transactionRepository = new TransactionRepository;
        const mockTransactionRepository = sinon.mock(transactionRepository);
        mockTransactionRepository.expects("add").never();

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository);
        await performCashInUseCase.execute(missingValueDto);

        mockCashInPresenter.verify();
        mockTransactionRepository.verify();
    });

    it("Should present ok, when providing proper transaction input", async () => {

        const properDto = new PerformCashInUseCaseDto(cashInDto);

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("ok").once();

        const transactionRepository = new TransactionRepository;
        const mockTransactionRepository = sinon.mock(transactionRepository);
        mockTransactionRepository.expects("add").once();

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository);
        await performCashInUseCase.execute(properDto);

        mockCashInPresenter.verify();
        mockTransactionRepository.verify();
    });

    it("Should present internal error, when repository throws error", async () => {

        const properDto = new PerformCashInUseCaseDto(cashInDto);

        const cashInPresenter = new CashInPresenter;
        const mockCashInPresenter = sinon.mock(cashInPresenter);
        mockCashInPresenter.expects("internalError").once();

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "add").rejects("Error");

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, transactionRepository);
        await performCashInUseCase.execute(properDto);

        mockCashInPresenter.verify();
    });

});
