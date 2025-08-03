const knex = require("../database/knex");

class AgencyRepository {
    async findByName(name) {
        const agency = await knex("Agency").where({ name }).first();

        return agency;
    }

    async findById(id) {
        const agency = await knex("Agency").where({ id }).first();

        return agency;
    };

    async create({ name, storage_limit, domain_limit, access_bids, access_publications, enabled_status }) {
        const [agencyId] = await knex("Agency").insert({
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status
        });

        return { id: agencyId };
    };

    async update(agency) {
        const agencyUpdate = await knex("Agency").update(agency).where({ id: agency.id });

        return agencyUpdate;
    };

    async getAgencies() {
        const agencies = await knex("Agency").orderBy("name");

        return agencies;
    };

    async delete(id) {
        return await knex("Agency").where({ id }).delete();
    }
};

module.exports = AgencyRepository;