"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Presenter } = require("../../../src/usecase/Presenter");
const { TransactionRepository } = require("../../../src/usecase/transaction/TransactionRepository");
const { ListTransactionsUseCase } = require("../../../src/usecase/transaction/ListTransactionsUseCase");
const { Transaction } = require("../../../src/entity/Transaction");


class TransactionPresenter extends Presenter {
    ok(payload) {}
    validationError(invalidFields) {}
    internalError(message) {}
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

const transactionDto = {
    userId: cashInDto.userId,
    value: cashInDto.value,
    description: cashInDto.description,
    paymentMethod: cashInDto.paymentMethod
};


describe("List Transactions Use Case #unit", () => {

    it("Should present transaction dto, when providing valid user id", async () => {

        const transaction = new Transaction(cashInDto);
        const transactions = [transaction];

        const transactionRepository = new TransactionRepository;
        sinon.stub(transactionRepository, "findTransactionsByUserId").resolves(transactions);

        const presenter = new TransactionPresenter;
        sinon.spy(presenter, "ok");

        const performCashInUseCase = new ListTransactionsUseCase(presenter, transactionRepository);
        await performCashInUseCase.execute({userId: 1});

        const transactionsDto = [transactionDto];
        const transactionDtoGenerated = presenter.ok.getCall(0).args[0];
        expect(transactionDtoGenerated).to.deep.equal(transactionsDto);
    });

});
