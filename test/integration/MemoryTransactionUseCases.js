"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Presenter } = require("../../src/usecase/Presenter");

const { MemoryDI } = require("../../src/usecase/transaction/MemoryDI");
const { MemoryTransactionRepository } = require("../../src/usecase/transaction/MemoryTransactionRepository");

beforeEach(() => MemoryTransactionRepository.clearDatabase());


class TransactionPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
}

const cashInDto = (value = 100, paymentMethod = "credit_card", userId = "1234") => ({
    userId: userId,
    value: value,
    description: "Smartband XYZ 3.0",
    paymentMethod: paymentMethod,
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
});


describe("Transaction Use Cases #integration", () => {

    it("Should send only waiting_funds to presenter, when performing cash ins use case", async () => {

        const memoryDi = new MemoryDI;

        const cashInDto1 = cashInDto();
        const presenter1 = new TransactionPresenter;
        const cashInUseCase1 = memoryDi.performCashInUseCase(presenter1);
        await cashInUseCase1.execute(cashInDto1);

        const presenter2 = new TransactionPresenter;
        sinon.spy(presenter2, "ok");
        const listFundsUseCase = memoryDi.listFundsByUserIdUseCase(presenter2);
        await listFundsUseCase.execute(cashInDto1);

        const expectedFundsReportDto = {
            available: 0,
            waiting_funds: 95
        };

        const fundsReportDtoGenerated = presenter2.ok.getCall(0).args[0];
        expect(fundsReportDtoGenerated).to.deep.equal(expectedFundsReportDto);
    });

    it("Should send waiting_funds and available to presenter, when performing two cash ins use case", async () => {

        const memoryDi = new MemoryDI;

        const cashInDto1 = cashInDto();
        const presenter1 = new TransactionPresenter;
        const cashInUseCase1 = memoryDi.performCashInUseCase(presenter1);
        await cashInUseCase1.execute(cashInDto1);

        const cashInDto2 = cashInDto(100, "debit_card");
        const cashInUseCase2 = memoryDi.performCashInUseCase(presenter1);
        await cashInUseCase1.execute(cashInDto2);

        const presenter2 = new TransactionPresenter;
        sinon.spy(presenter2, "ok");
        const listFundsUseCase = memoryDi.listFundsByUserIdUseCase(presenter2);
        await listFundsUseCase.execute(cashInDto1);

        const expectedFundsReportDto = {
            available: 97,
            waiting_funds: 95
        };

        const fundsReportDtoGenerated = presenter2.ok.getCall(0).args[0];
        expect(fundsReportDtoGenerated).to.deep.equal(expectedFundsReportDto);
    });

    it("Should send only waiting_funds to presenter, when performing two cash ins for different user ids", async () => {

        const memoryDi = new MemoryDI;

        const cashInDto1 = cashInDto(100, "credit_card");
        const presenter1 = new TransactionPresenter;
        const cashInUseCase1 = memoryDi.performCashInUseCase(presenter1);
        await cashInUseCase1.execute(cashInDto1);

        const cashInDto2 = cashInDto(100, "credit_card", "7890");
        const cashInUseCase2 = memoryDi.performCashInUseCase(presenter1);
        await cashInUseCase1.execute(cashInDto2);

        const presenter2 = new TransactionPresenter;
        sinon.spy(presenter2, "ok");
        const listFundsUseCase = memoryDi.listFundsByUserIdUseCase(presenter2);
        await listFundsUseCase.execute(cashInDto2);

        const expectedFundsReportDto = {
            available: 0,
            waiting_funds: 95
        };

        const fundsReportDtoGenerated = presenter2.ok.getCall(0).args[0];
        expect(fundsReportDtoGenerated).to.deep.equal(expectedFundsReportDto);
    });

});
