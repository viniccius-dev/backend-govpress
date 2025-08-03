exports.up = knex => knex.schema.createTable("Agency", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("storage_limit").notNullable();
    table.boolean("access_bids").notNullable();
    table.boolean("access_publications").notNullable();
    table.boolean("enabled_status").notNullable();
    table.integer("domain_limit").notNullable();
});

exports.down = knex => knex.schema.dropTable("Agency");