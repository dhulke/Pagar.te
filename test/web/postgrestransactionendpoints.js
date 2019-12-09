"use stricct";

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const request = require('supertest');


const { PostgresDI } = require("../../src/usecase/transaction/PostgresDI");

const postgresDi = new PostgresDI("unittest");
const app = require("../../src/entrypoint/web/app")(postgresDi);

const knexConfig = require("../../db/postgres/knexfile");
const knex = require('knex')(knexConfig["unittest"]);

beforeEach(async () => {
    await knex("transaction").del();
    await knex("payable").del();
});

after(() => {
    postgresDi.shutdown();
    knex.destroy();
});



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


describe("Postgres Web Transaction Use Cases Routes #integration #web", () => {

    it("Should return Ok on test route", async () => {
        await request(app).get('/transaction/test').expect(200).expect({ok:true, message: "it worked"});
    });

    describe("POST /transaction/cashin & GET /transaction/funds/user/:id", () => {
        it("Should return waiting_funds with applied fee for credit card transaction", async () => {
            const cashInDto1 = cashInDto();

            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto1)
                .expect(200);

            const expectedFundsReportDto = {
                available: 0,
                waiting_funds: 95
            };

            await request(app)
                .get("/transaction/funds/user/1234")
                .expect(200)
                .expect(expectedFundsReportDto);
        });
    });

    describe("POST /transaction/cashin x2 & GET /transaction/funds/user/:id", () => {
        it("Should return waiting_funds and available with applied fee for credit and debit card transactions", async () => {

            const cashInDto1 = cashInDto();
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto1)
                .expect(200);

            const cashInDto2 = cashInDto(100, "debit_card");
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto2)
                .expect(200);

            const expectedFundsReportDto = {
                available: 97,
                waiting_funds: 95
            };

            await request(app)
                .get("/transaction/funds/user/1234")
                .expect(200)
                .expect(expectedFundsReportDto);
        });
    });

    describe("POST /transaction/cashin x2 & GET /transaction/funds/user/:id", () => {
        it("Should return only waiting_funds with applied fee, when performing debit card cash in for a different user", async () => {
            const cashInDto1 = cashInDto();
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto1)
                .expect(200);

            const cashInDto2 = cashInDto(100, "credit_card", "7890");
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto2)
                .expect(200);

            const expectedFundsReportDto = {
                available: 0,
                waiting_funds: 95
            };

            await request(app)
                .get("/transaction/funds/user/7890")
                .expect(200)
                .expect(expectedFundsReportDto);
        });
    });

    describe("POST /transaction/cashin x2 & GET /transaction/list/user/:id", () => {
        it("Should return two transactions, when performing two cash ins", async () => {

            const cashInDto1 = cashInDto();
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto1)
                .expect(200);

            const cashInDto2 = cashInDto(100, "debit_card");
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto2)
                .expect(200);

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
                }
            ];

            await request(app)
                .get("/transaction/list/user/1234")
                .expect(200)
                .expect(expectedTransactionsDto);
        });
    });

    describe("POST /transaction/cashin & GET /transaction/list/user/:id", () => {
        it("Should return one transaction, when performing two cash ins for different users", async () => {

            const cashInDto1 = cashInDto();
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto1)
                .expect(200);

            const cashInDto2 = cashInDto(100, "debit_card", "7890");
            await request(app)
                .post("/transaction/cashin")
                .send(cashInDto2)
                .expect(200);

            const expectedTransactionsDto = [
                {
                    value: cashInDto1.value,
                    description: cashInDto1.description,
                    paymentMethod: cashInDto1.paymentMethod
                }
            ];

            await request(app)
                .get(`/transaction/list/user/${cashInDto1.userId}`)
                .expect(200)
                .expect(expectedTransactionsDto);
        });
    });
});
