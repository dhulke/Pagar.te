"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Transaction } = require("../../../src/entity/Transaction");
const { TransactionMapper } = require("../../../src/usecase/transaction/TransactionMapper");


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


describe("Transaction Mapper #class", () => {
    describe("#mapTransactionToDto", () => {

        it("Should return presenter dto when passing valid transactions", () => {

            const transaction = new Transaction(cashInDto);
            const transactionAssembler = new TransactionMapper;

            const transactionDto = transactionAssembler.mapTransactionToDto(transaction);

            const expectedTransactionDto = {
                value: cashInDto.value,
                description: cashInDto.description,
                paymentMethod: cashInDto.paymentMethod
            };

            expect(transactionDto).to.deep.include(expectedTransactionDto);
        });

    });

});
