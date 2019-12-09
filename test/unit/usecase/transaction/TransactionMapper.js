"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Transaction } = require("../../../../src/entity/Transaction");
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


describe("Transaction Mapper #class", () => {
    describe("#mapTransactionToDto", () => {

        it("Should return presenter dto when passing valid transactions", () => {

            const cashInDto1 = cashInDto();
            const transaction = new Transaction(cashInDto1);
            const transactionMapper = new TransactionMapper;

            const transactionDto = transactionMapper.mapTransactionToDto(transaction);

            const expectedTransactionDto = {
                value: cashInDto1.value,
                description: cashInDto1.description,
                paymentMethod: cashInDto1.paymentMethod
            };

            expect(transactionDto).to.deep.include(expectedTransactionDto);
        });

    });

    describe("#toPersistenceDto", () => {

        it("Should return persistence dto when passing cashed in transactions", async () => {

            const fundsService = new FundsService;
            sinon.stub(fundsService, "isFundsAvailable").resolves(true);

            const cashInDto1 = cashInDto();
            const transaction = new Transaction(cashInDto1);
            await transaction.cashIn(fundsService);

            const transactionMapper = new TransactionMapper;
            const transactionDto = transactionMapper.toPersistenceDto(transaction);

            const THIRTY_DAYS = 60 * 60 * 24 * 30;
            const transactionDate = transaction.getDate().getTime() / 1000;
            cashInDto1.cardNumber = cashInDto1.cardNumber.slice(-4);
            cashInDto1.cvv = "XXX";
            cashInDto1.date = transactionDate;
            cashInDto1.payables = [{
                value: 95,
                date: transactionDate + THIRTY_DAYS,
                status: "waiting_funds"
            }];

            expect(transactionDto).to.deep.equal(cashInDto1);
        });

    });

});
