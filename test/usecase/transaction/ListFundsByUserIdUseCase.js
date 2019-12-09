"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Presenter } = require("../../../src/usecase/Presenter");
const { TransactionRepository } = require("../../../src/usecase/transaction/TransactionRepository");
const { ListFundsByUserIdUseCase } = require("../../../src/usecase/transaction/ListFundsByUserIdUseCase");
const { Transaction } = require("../../../src/entity/Transaction");
const { FundsService } = require("../../../src/service/FundsService");


class TransactionPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
}

const cashInDtoGivenValuePaymentMethod = (value, paymentMethod = "credit_card") => ({
    userId: "1234",
    value: value,
    description: "Smartband XYZ 3.0",
    paymentMethod: paymentMethod,
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
});


describe("List Funds By User Id Use Case #unit", () => {

    it("Should present only waiting_funds, given 2 cashed in credit card transactions", async () => {

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const cashInDto = cashInDtoGivenValuePaymentMethod(100);
        const transaction1 = new Transaction(cashInDto);
        await transaction1.cashIn(fundsService);
        const transaction2 = new Transaction(cashInDto);
        await transaction2.cashIn(fundsService);
        const transactions = [transaction1, transaction2];


        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "findTransactionsByUserId").resolves(transactions);

        const presenter = new TransactionPresenter;
        sinon.spy(presenter, "ok");

        const performCashInUseCase = new ListFundsByUserIdUseCase(presenter, transactionRepository);
        await performCashInUseCase.execute({userId: "1234"});

        const expectedFundsReportDto = {
            available: 0,
            waiting_funds: 190
        };

        const fundsReportDtoGenerated = presenter.ok.getCall(0).args[0];
        expect(fundsReportDtoGenerated).to.deep.equal(expectedFundsReportDto);
    });

    it("Should present paid and waiting_funds, given credit and debit transactions", async () => {

        const fundsService = new FundsService;
        sinon.stub(fundsService, "isFundsAvailable").resolves(true);

        const cashInDto1 = cashInDtoGivenValuePaymentMethod(100);
        const transaction1 = new Transaction(cashInDto1);
        await transaction1.cashIn(fundsService);

        const cashInDto2 = cashInDtoGivenValuePaymentMethod(100, "debit_card");
        const transaction2 = new Transaction(cashInDto2);
        await transaction2.cashIn(fundsService);
        const transactions = [transaction1, transaction2];


        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "findTransactionsByUserId").resolves(transactions);

        const presenter = new TransactionPresenter;
        sinon.spy(presenter, "ok");

        const performCashInUseCase = new ListFundsByUserIdUseCase(presenter, transactionRepository);
        await performCashInUseCase.execute({userId: "1234"});

        const expectedFundsReportDto = {
            available: 97,
            waiting_funds: 95
        };

        const fundsReportDtoGenerated = presenter.ok.getCall(0).args[0];
        expect(fundsReportDtoGenerated).to.deep.equal(expectedFundsReportDto);
    });

});
