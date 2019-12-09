exports.up = function (knex) {
    return knex.schema.createTable("transaction", (table) => {
        table.increments();
        table.string("userId").notNullable();
        table.string("value").notNullable();
        table.string("description").notNullable();
        table.string("paymentMethod").notNullable();
        table.string("cardNumber").notNullable();
        table.string("cardHolderName").notNullable();
        table.string("expirationDate").notNullable();
        table.string("cvv").notNullable();
        table.string("date").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("transaction");
};
