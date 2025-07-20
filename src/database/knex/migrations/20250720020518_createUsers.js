exports.up = knex => knex.schema.createTable("User", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
    table.integer("domain_id").references("id").inTable("Domain").onDelete("CASCADE");
    table.integer("agency_id").references("id").inTable("Agency").onDelete("CASCADE");

    table
    .enum("role", ["admin", "manager", "common"], { useNative: true, enumName: "roles" })
    .notNullable();

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("User");