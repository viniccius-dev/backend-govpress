exports.up = knex => knex.schema.createTable("Domain", table => {
    table.increments("id");
    table.text("domain_name").notNullable();
    table.text("url").notNullable();
    table.integer("agency_id").references("id").inTable("Agency").onDelete("CASCADE");
});

exports.down = knex => knex.schema.dropTable("Domain");