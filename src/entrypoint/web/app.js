const express = require("express");

const { TransactionRouter } = require("./route/TransactionRouter");











module.exports = (diTransactionUseCase) => {


    const transactionRouter = new TransactionRouter(diTransactionUseCase);

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));


    app.use("/transaction", transactionRouter.getRouter());

    return app;
}
