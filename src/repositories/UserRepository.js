const knex = require("../database/knex");

class UserRepository {
    async findById(id) {
        const user = await knex("User").where({ id }).first();

        return user;
    };

    async findByEmail(email) {
        const user = await knex("User").where({ email }).first();

        return user;
    };

    async create({ name, email, password, domain_id, agency_id, register_role }) {
        const [userId] = await knex("User").insert({
            name,
            email,
            password,
            domain_id,
            agency_id,
            role: register_role
        });

        return { id: userId };
    };

    async update(user) {
        const userUpdated = await knex("User").update(user).where({ id: user.id });

        return userUpdated;
    };
}

module.exports = UserRepository;