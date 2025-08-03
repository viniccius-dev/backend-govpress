const AppError = require("../utils/AppError");

class AgenciesService {
    constructor(agencyRepository) {
        this.agencyRepository = agencyRepository;
    };

    async agencyCreate({ name, storage_limit, domain_limit, access_bids, access_publications, enabled_status }) {
        const requiredFields = [name, storage_limit, domain_limit, access_bids, access_publications, enabled_status];
        const hasNullOrUndefined = requiredFields.some(field => field === undefined || field === null);

        if (hasNullOrUndefined) {
            throw new AppError("Favor inserir todas as informações");
        }

        const checkAgency = await this.agencyRepository.findByName(name);

        if(checkAgency) {
            throw new AppError("Essa agência já está cadastrada.", 409);
        };

        const agencyCreate = await this.agencyRepository.create({
            name,
            storage_limit,
            domain_limit,
            access_bids,
            access_publications,
            enabled_status
        });

        return agencyCreate;
    };

    async agencyUpdate({
        name,
        storage_limit,
        domain_limit,
        access_bids,
        access_publications,
        enabled_status,
        agency_id
    }) {
        const agency = await this.agencyRepository.findById(agency_id);

        if(!agency) {
            throw new AppError("Agência não encontrada.", 404);
        };

        const checkAgency = await this.agencyRepository.findByName(name ?? "");

        if(checkAgency && checkAgency.id !== agency.id) {
            throw new AppError("Esse nome já está em uso. Por favor escolha outro.", 409);
        };

        agency.name = name ?? agency.name;
        agency.storage_limit = storage_limit ?? agency.storage_limit;
        agency.domain_limit = domain_limit ?? agency.domain_limit;
        agency.access_bids = access_bids ?? agency.access_bids;
        agency.access_publications = access_publications ?? agency.access_publications;
        agency.enabled_status = enabled_status ?? agency.enabled_status;

        const  agencyUpdate = await this.agencyRepository.update(agency);
        
        return agencyUpdate;
    };

    async showAgency(agency_id) {
        const agency = await this.agencyRepository.findById(agency_id);

        if(!agency) {
            throw new AppError("Agência não encontrada.", 404);
        };

        return agency;
    }
};

module.exports = AgenciesService;