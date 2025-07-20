const knex = require("../database/knex");

class UserRepository {
    async findById(id) {
        const user = await knex("User").where({ id }).first();

        return user;
    }

    async findByEmail(email) {
        const user = await knex("User").where({ email }).first();

        return user;
    };

    async create({ name, email, password, domain_id, agency_id, role }) {
        const [userId] = await knex("User").insert({
            name,
            email,
            password,
            domain_id,
            agency_id,
            role
        });

        return { id: userId };
    };
}

module.exports = UserRepository;