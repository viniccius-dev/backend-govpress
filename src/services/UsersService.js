
const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

// const DomainRepository = require("../repositories/DomainRepository");

class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async userCreate({ name, email, password, domain_id, agency_id, role }) {

        if( !name || !email || !password || !domain_id || !role ) {
            throw new AppError("Favor inserir todas as informações");
        };

        // TODO: Adicionar uma validação de: user_role <> "admin" e role === "admin" || role === "manager"

        const checkUserExist = await this.userRepository.findByEmail(email);

        if(checkUserExist) {
            throw new AppError("Este e-mail já está em uso.");
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
            role
        });

        return userCreated;
    }
};

module.exports = UsersService;