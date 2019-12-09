"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { Transaction } = require("../../../src/entity/Transaction");
const { FundsReportService } = require("../../../src/service/FundsReportService");
const { FundsService } = require("../../../src/service/FundsService");


const cashInDto = {
    userId: "1234",
    value: 100,
    description: "Smartband XYZ 3.0",
    paymentMethod: "credit_card",
    cardNumber: "0123 4567 8910 1112",
    cardHolderName: "John Doe",
    expirationDate: "12/24",
    cvv: 123
};


describe("FundsReportService #class", () => {
    describe("#generateFundsReport", () => {

        it("Should return only waiting_funds, given 2 cashed in credit card transactions", async () => {

            const fundsService = new FundsService;
            sinon.stub(fundsService, "isFundsAvailable").resolves(true);

            const transaction1 = new Transaction(cashInDto);
            await transaction1.cashIn(fundsService);
            const transaction2 = new Transaction(cashInDto);
            await transaction2.cashIn(fundsService);
            const transactions = [transaction1, transaction2];

            const fundsReportService = new FundsReportService(transactions);
            const reportDto = fundsReportService.generateFundsReport();

            const expectedReportDto = {
                available: 0,
                waiting_funds: 190
            };

            expect(reportDto).to.deep.include(expectedReportDto);
        });

        it("Should return paid and waiting_funds, given credit and debit transactions", async () => {

            const fundsService = new FundsService;
            sinon.stub(fundsService, "isFundsAvailable").resolves(true);

            const transaction1 = new Transaction(cashInDto);
            await transaction1.cashIn(fundsService);
            cashInDto.paymentMethod = "debit_card";
            const transaction2 = new Transaction(cashInDto);
            await transaction2.cashIn(fundsService);
            const transactions = [transaction1, transaction2];

            const fundsReportService = new FundsReportService(transactions);
            const reportDto = fundsReportService.generateFundsReport();

            const expectedReportDto = {
                available: 97,
                waiting_funds: 95
            };

            expect(reportDto).to.deep.include(expectedReportDto);
        });

    });

});
