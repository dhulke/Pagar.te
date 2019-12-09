exports.up = function (knex) {
    return knex.schema.createTable("payable", (table) => {
        table.increments();
        table.integer("transactionId").notNullable();
        table.string("value").notNullable();
        table.string("date").notNullable();
        table.string("status").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("payable");
};
