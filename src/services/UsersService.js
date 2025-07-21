
const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

// const DomainRepository = require("../repositories/DomainRepository");

class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async userCreate({ name, email, password, domain_id, agency_id, register_role, user_role }) {

        // Verifica se o usuário é manager, podendo criar apenas usuários common
        if( user_role === "manager" ) {
            register_role = "common"
        };

        // Verifica campos obrigatórios básicos
        if (!name || !email || !password || !register_role) {
            throw new AppError("Favor inserir todas as informações.");
        };
    
        // Validação condicional com base no tipo de registro
        if (register_role === "manager") {
            if (!agency_id) {
                throw new AppError("Favor inserir todas as informações.");
            };
        };
    
        if (register_role === "common") {
            if (!agency_id || !domain_id) {
                throw new AppError("Favor inserir todas as informações.");
            };
        };

        const hashedPassword = await hash(password, 10);

        // TODO: Validação de domínio existente

        // const domainRepository = new DomainRepository();
        // const domain = await domainRepository.findById(domain_id);

        // if(!domain) {
        //     throw new AppError("Domínio não encontrado.", 404);
        // };

        const userCreated = await this.userRepository.create({ 
            name, 
            email, 
            password: hashedPassword, 
            domain_id, 
            agency_id,
            register_role
        });

        return userCreated;
    }
};

module.exports = UsersService;