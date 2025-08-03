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

    async update(request, response) {
        const {
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status
        } = request.body;
        const { agency_id } = request.params;

        const agencyRepository = new AgencyRepository();
        const agenciesService = new AgenciesService(agencyRepository);
        await agenciesService.agencyUpdate({
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status,
            agency_id
        });

        return response.json({ message: "Informações da agência atualizadas com sucesso." });
    };

    async index(request, response) {
        const agencyRepository = new AgencyRepository();
        const agency = await agencyRepository.getAgencies();
        
        return response.json(agency);
    };

    async show(request, response) {
        const { agency_id } = request.params;

        const agencyRepository = new AgencyRepository()
        const agenciesService = new AgenciesService(agencyRepository);
        const agency = await agenciesService.showAgency(agency_id);

        return response.json(agency);
    };

    async delete(request, response) {
        const { agency_id } = request.params;

        const agencyRepository = new AgencyRepository();
        const agenciesService = new AgenciesService(agencyRepository);
        await agenciesService.agencyDelete(agency_id);

        return response.json({ message: "Agência excluida com sucesso." }); 
    }

};

module.exports = AgenciesController;