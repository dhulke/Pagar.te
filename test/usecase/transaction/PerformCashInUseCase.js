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
const { PayableStatus } = require("../../../src/entity/Payable");


class CashInPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
}

class TestRepository extends TransactionRepository {
    async add(transactionEntity) {}
}

const cashInDto = (value = 100, paymentMethod = "credit_card") => ({
    userId: "1234",
    value: value,
    description: "Smartband XYZ 3.0",
    paymentMethod: paymentMethod,
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
});


describe("Perform Cash-In Use Case #unit", () => {

    it("Should save credit_card transaction payable with a 5% fee, D+30 and waiting funds status", async () => {

        const properDto = cashInDto(100);

        const cashInPresenter = new CashInPresenter;
        const testRepository = new TestRepository;
        sinon.stub(testRepository, "add");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, testRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        const transaction = testRepository.add.getCall(0).args[0];
        const payable = transaction.getPayables()[0];

        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
        const transactionDate = transaction.getDate().getTime() + THIRTY_DAYS;

        const payableValue = payable.getValue();
        const payableDate = payable.getDate().getTime();
        const payableStatus = payable.getStatus();

        expect(payableValue).to.be.equal(95);
        expect(payableDate).to.be.equal(transactionDate);
        expect(payableStatus).to.be.equal(PayableStatus.WAITING_FUNDS);
    });

    it("Should save debit_card transaction payable with a 3% fee, D+0 and paid status", async () => {

        const properDto = cashInDto(100, "debit_card");

        const cashInPresenter = new CashInPresenter;
        const testRepository = new TestRepository;
        sinon.stub(testRepository, "add");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, testRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        const transaction = testRepository.add.getCall(0).args[0];
        const payable = transaction.getPayables()[0];

        const transactionDate = transaction.getDate().getTime();

        const payableValue = payable.getValue();
        const payableDate = payable.getDate().getTime();
        const payableStatus = payable.getStatus();

        expect(payableValue).to.be.equal(97);
        expect(payableDate).to.be.equal(transactionDate);
        expect(payableStatus).to.be.equal(PayableStatus.PAID);
    });

    it("Should save card number's last four digits only", async () => {

        const properDto = cashInDto();

        const cashInPresenter = new CashInPresenter;
        const testRepository = new TestRepository;
        sinon.stub(testRepository, "add");

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const performCashInUseCase = new PerformCashInUseCase(cashInPresenter, testRepository, fundsService);
        await performCashInUseCase.execute(properDto);

        const transaction = testRepository.add.getCall(0).args[0];

        const expectedLastFourDigits = properDto.cardNumber.slice(-4);
        expect(transaction.getCard().getSafeNumber()).to.equal(expectedLastFourDigits);
    });

    it("Should send ok to presenter, when providing proper transaction input", async () => {

        const properDto = cashInDto();

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

    it("Should send validation error to presenter, when not providing transaction value", async () => {

        const missingValueDto = cashInDto();
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

    it("Should send internal error to presenter, when not providing user id", async () => {

        const missingValueDto = cashInDto();
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

    it("Should send internal error to presenter, when repository throws error", async () => {

        const properDto = cashInDto();

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

    it("Should send internal error to presenter, when funds aren't available", async () => {

        const properDto = cashInDto();

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
