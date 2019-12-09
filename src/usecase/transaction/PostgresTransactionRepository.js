const { TransactionMapper } = require("./TransactionMapper");
const { Transaction } = require("../../entity/Transaction");

let database = {};

class PostgresTransactionRepository {

    constructor(knex) {
        this.knex = knex;
    }

    async findTransactionsByUserId(userId) {
        try {
            const transactions = [];
            const transactionsDto = await this.knex("transaction").where({userId: userId});
            for(const transactionDto of transactionsDto) {// single select is better.
                const payables = await this.knex("payable").where({transactionId: transactionDto.id})
                transactionDto.payables = payables;
                const transaction = new Transaction(transactionDto);
                transactions.push(transaction);
            }
            return transactions;
        } catch(error) {
        }

    }

    async add(transactionEntity) {
        try {
            const transactionMapper = new TransactionMapper;
            const dto = transactionMapper.toPersistenceDto(transactionEntity);
            const payables = dto.payables;
            delete dto.payables;

            const transactionId = await this.knex("transaction").insert(dto).returning("id");
            for(const payable of payables) {
                payable.transactionId = parseInt(transactionId);
            }
            await this.knex("payable").insert(payables);
        } catch(error) {
            console.log(error)
        }

    }

    static async clearDatabase() {
        await this.knex("transaction").del();
        await this.knex("payable").del();
    }
}

module.exports = { PostgresTransactionRepository };
