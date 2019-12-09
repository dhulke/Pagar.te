const { TransactionMapper } = require("./TransactionMapper");
const { Transaction } = require("../../entity/Transaction");

let database = {};

class MemoryTransactionRepository {

    async findTransactionsByUserId(userId) {
        if(database[userId]) {
            const transactions = [];
            for(const transactionDto of database[userId]) {
                const transaction = new Transaction(transactionDto);
                transactions.push(transaction);
            }
            return transactions;
        }
        return [];
    }

    async add(transactionEntity) {
        const transactionMapper = new TransactionMapper;
        const dto = transactionMapper.toPersistenceDto(transactionEntity);
        if(!database[dto.userId]) {
            database[dto.userId] = [];
        }
        database[dto.userId].push(dto);
    }

    static clearDatabase() {
        database = {};
    }
}

module.exports = { MemoryTransactionRepository };
