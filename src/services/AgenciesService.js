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
};

module.exports = AgenciesService;