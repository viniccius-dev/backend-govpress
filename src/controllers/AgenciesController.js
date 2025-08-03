const AgencyRepository = require("../repositories/AgencyRepository");;
const AgenciesService = require("../services/AgenciesService");

class AgenciesController {

    async create(request, response) {
        const {
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status
        } = request.body;

        const agencyRepository = new AgencyRepository();
        const agenciesService = new AgenciesService(agencyRepository);
        await agenciesService.agencyCreate({
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status
        });

        return response.status(201).json({ message: "Agência cadastrada com sucesso." });
    };

};

module.exports = AgenciesController;