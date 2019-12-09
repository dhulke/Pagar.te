"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Presenter } = require("../../../src/usecase/Presenter");
const { TransactionRepository } = require("../../../src/usecase/transaction/TransactionRepository");
const { ListTransactionsByUserIdUseCase } = require("../../../src/usecase/transaction/ListTransactionsByUserIdUseCase");
const { Transaction } = require("../../../src/entity/Transaction");


class TransactionPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
}

const cashInDtoGivenValue = value => ({
    userId: "1234",
    value: value,
    description: "Smartband XYZ 3.0",
    paymentMethod: "credit_card",
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
});


describe("List Transactions By User Id Use Case #unit", () => {

    it("Should present transaction dto, when providing valid user id with 1 transaction", async () => {

        const cashInDto = cashInDtoGivenValue(100);
        const transaction = new Transaction(cashInDto);
        const transactions = [transaction];

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "findTransactionsByUserId").resolves(transactions);

        const presenter = new TransactionPresenter;
        sinon.spy(presenter, "ok");

        const performCashInUseCase = new ListTransactionsByUserIdUseCase(presenter, transactionRepository);
        await performCashInUseCase.execute({userId: "1234"});

        const expectedTransactionsDto = [{
            value: cashInDto.value,
            description: cashInDto.description,
            paymentMethod: cashInDto.paymentMethod
        }];

        const transactionDtoGenerated = presenter.ok.getCall(0).args[0];
        expect(transactionDtoGenerated).to.deep.equal(expectedTransactionsDto);
    });

    it("Should present transaction dto, when providing valid user id with 2 transaction", async () => {
        const cashInDto1 = cashInDtoGivenValue(100);
        const transaction1 = new Transaction(cashInDto1);
        const cashInDto2 = cashInDtoGivenValue(150);
        const transaction2 = new Transaction(cashInDto2);
        const transactions = [transaction1, transaction2];

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "findTransactionsByUserId").resolves(transactions);

        const presenter = new TransactionPresenter;
        sinon.spy(presenter, "ok");

        const performCashInUseCase = new ListTransactionsByUserIdUseCase(presenter, transactionRepository);
        await performCashInUseCase.execute({userId: "1234"});

        const expectedTransactionsDto = [
            {
                value: cashInDto1.value,
                description: cashInDto1.description,
                paymentMethod: cashInDto1.paymentMethod
            },
            {
                value: cashInDto2.value,
                description: cashInDto2.description,
                paymentMethod: cashInDto2.paymentMethod
            }];

        const transactionDtoGenerated = presenter.ok.getCall(0).args[0];
        expect(transactionDtoGenerated).to.deep.equal(expectedTransactionsDto);
    });

});
