const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT Token não informado", 401);
    };

    const [, token] = authHeader.split(" ");

    try {
        const { role, agency_id, domain_id, sub: user_id } = verify(token, authConfig.jwt.secret);

        request.user = {
            id: Number(user_id),
            role,
            agency_id,
            domain_id
        };

        return next();
    } catch {
        throw new AppError("JWT Token Inválido.", 401);
    };
};

module.exports = ensureAuthenticated;