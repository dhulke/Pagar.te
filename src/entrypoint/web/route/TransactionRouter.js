var express = require("express");

const { Presenter } = require("../../../usecase/Presenter");


class TransactionRouter extends Presenter {

    constructor(diUseCase) {
        super();
        this.diUseCase = diUseCase;
        this.router = express.Router();
        this.loadRoutes();
    }

    getRouter() {
        return this.router;
    }

    loadRoutes() {
        this.router.post("/cashin", this.cashIn.bind(this));
        this.router.get("/funds/user/:id", this.funds.bind(this));
        this.router.get("/list/user/:id", this.list.bind(this));
        this.router.get("/test", this.test.bind(this));
    }

    async cashIn(req, res) {
        const commandUseCase = await this.diUseCase.performCashInUseCase(this);
        await commandUseCase.execute(req.body);
        this.sendDtoResponseBack(res);
    }

    async funds(req, res) {
        const commandUseCase = await this.diUseCase.listFundsByUserIdUseCase(this);
        await commandUseCase.execute({ userId : req.params.id});
        this.sendDtoResponseBack(res);
    }

    async list(req, res) {
        const commandUseCase = await this.diUseCase.listTransactionsByUserIdUseCase(this);
        await commandUseCase.execute({ userId : req.params.id});
        this.sendDtoResponseBack(res);
    }

    test(req, res) {
        res.json({ok:true, message: "it worked"});
    }

    sendDtoResponseBack(res) {
        res.status(this.responseCode).json(this.payload);
    }

    ok(payloadDto) {
        this.responseCode = 200;
        this.payload = payloadDto;
    }

    invalidError(message) {
        this.responseCode = 422;
        this.payload = { ok: false, message };
    }

    internalError(message) {
        this.responseCode = 500;
        this.payload = { ok: false, message };
    }
}

module.exports = { TransactionRouter };
