
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
    };

    async userUpdate({ 
        modify_user_id,
        name, 
        email, 
        password,
        modify_domain_id, 
        user_id, 
        user_role,
        domain_id
    }) {
        // TODO: Caso o `user_role` seja "manager", filtrar usuário por id e domain_id do user do solicitante da alteração
        const user = await this.userRepository.findById(modify_user_id);

        if(!user) {
            throw new AppError("Usuário não encontrado", 404);
        };

        const isSameUser = modify_user_id === user_id;

        if(user_role === "common" && !isSameUser) {
            throw new AppError("Não Autorizado.", 403);
        };

        if(user_role === "manager" && user.role !== "common" && !isSameUser) {
            throw new AppError("Não autorizado.", 403);
        };

        if(user_role === "admin" && user.role === "admin" && !isSameUser) {
            throw new AppError("Não autorizado.", 403);
        } 

        if(name !== "") {
            user.name = name ?? user.name;
        }

        if(email) {
            const userWithUpdateEmail = await this.userRepository.findByEmail(email);

            if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
                throw new AppError("Esse e-mail já está em uso. Por favor escolha outro.");
            };

            user.email = email ?? user.email;
        }

        if(domain_id && user_role === "manager") {
            // TODO: Validação de domínio existente

            // const domainRepository = new DomainRepository();

            // const domain = await domainRepository.findById(domain_id);

            // if(!domain) {
            //     throw new AppError("Domínio não encontrado.", 404);
            // };

            user.domain_id = domain_id ?? user.domain_id;
        }

        user.password = password ? await hash(password, 10) : user.password;

        const updatedAt = new Date();
        const zonedDate = toZonedTime(updatedAt, 'UTC');
        user.updated_at = format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });

        const userUpdated = await this.userRepository.update(user);

        return userUpdated;
    }
};

module.exports = UsersService;