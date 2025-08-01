
const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

// const DomainRepository = require("../repositories/DomainRepository");

class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async userCreate({ name, email, password, domain_id, agency_id, register_role, user_role, creator_agency_id }) {

        // Verifica se o usuário é manager, podendo criar apenas usuários common e garante que o registro da agência seja o mesmo criador
        if(user_role === "manager") {
            register_role = "common";
            agency_id = creator_agency_id;

            // TODO: Verificar se domain_id informado pertence à agency_id (quando houver repositório de agencies)
        };

        // Caso o cadastrante seja admin garante:
            // Que se o usuário cadastrado for manager ou outro admin o domain_id seja null
            // Que o agency_id seja null se o usuário cadastro for admin
        if(user_role === "admin") {
            if(register_role !== "common") {
                domain_id = null;
            };

            if(register_role === "admin") {
                agency_id = null;
            };
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
        agency_id
    }) {
        
        let user;

        if (user_role === "manager") {
            user = await this.userRepository.findByIdAndAgencyId(modify_user_id, agency_id);
        } else {
            user = await this.userRepository.findById(modify_user_id);
        }

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

        if(name?.trim()) {
            user.name = name;
        }

        if(email) {
            const userWithUpdateEmail = await this.userRepository.findByEmail(email);

            if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
                throw new AppError("Esse e-mail já está em uso. Por favor escolha outro.");
            };

            user.email = email ?? user.email;
        }

        if(modify_domain_id && user_role !== "common" && !isSameUser && user.role === "common") {
            // TODO: Validação de domínio existente

            // const domainRepository = new DomainRepository();

            // const domain = await domainRepository.findById(domain_id);

            // if(!domain) {
            //     throw new AppError("Domínio não encontrado.", 404);
            // };

            user.domain_id = modify_domain_id ?? user.domain_id;
        }

        user.password = password ? await hash(password, 10) : user.password;

        const updatedAt = new Date();
        const zonedDate = toZonedTime(updatedAt, 'UTC');
        user.updated_at = format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });

        const userUpdated = await this.userRepository.update(user);

        return userUpdated;
    };

    async showUser({ id, agency_id }) {
        
        let user;

        if (agency_id) {
            user = await this.userRepository.findByIdAndAgencyId(id, agency_id);
        } else {
            user = await this.userRepository.findById(id);
        };

        if(!user) {
            throw new AppError("Usuário não encontrado.", 404);
        };

        delete user.password;

        return user;
    };

    async userDelete({ id, user_role, agency_id }) {
        let user;

        if (agency_id) {
            user = await this.userRepository.findByIdAndAgencyId(id, agency_id);
        } else {
            user = await this.userRepository.findById(id);
        };

        if(!user) {
            throw new AppError("Usuário não encontrado.", 404);
        };

        if (
            (user_role === "admin" && user?.role === "admin") ||
            (user_role === "manager" && user?.role === "manager")
          ) {
            throw new AppError("Não autorizado.", 403);
          }

        return await this.userRepository.delete(id);
    }
};

module.exports = UsersService;