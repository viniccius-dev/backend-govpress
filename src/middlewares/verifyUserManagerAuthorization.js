const AppError = require("../utils/AppError");

function verifyUserManagerAuthorization() {
    return (request, response, next) => {
        const { role } = request.user;

        if(role !== 'admin' && role !== 'manager') {
            throw new AppError("Não autorizado.", 401);
        };

        return next();
    };
};

module.exports = verifyUserManagerAuthorization;