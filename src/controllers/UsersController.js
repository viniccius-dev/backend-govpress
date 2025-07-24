const UserRepository = require("../repositories/UserRepository");
const UsersService = require("../services/UsersService");

class UsersController {

    async create(request, response) {
        const { name, email, password, domain_id, agency_id, register_role } = request.body;
        const user_role = request.user.role;

        const userRepository = new UserRepository();
        const usersService = new UsersService(userRepository);
        await usersService.userCreate({
            name,
            email,
            password,
            domain_id,
            agency_id,
            register_role,
            user_role
        });

        return response.status(201).json({ message: "Perfil criado com sucesso." });
    };

    async update(request, response) {
        const { name, email, password, modify_domain_id, modify_user_id } = request.body;
        const user_id = request.user.id;
        const user_role = request.user.role;
        const { domain_id } = request.user;

        const userRepository = new UserRepository();
        const usersService = new UsersService(userRepository);
        const user = await usersService.userUpdate({
            modify_user_id,
            name, 
            email, 
            password,
            modify_domain_id, 
            user_id, 
            user_role,
            domain_id
        });

        return response.json({ user, message: "Perfil atualizado com sucesso." });
    }

};

module.exports = UsersController;

