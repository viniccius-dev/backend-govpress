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

};

module.exports = UsersController;

