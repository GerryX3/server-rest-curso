const jwt = require('jsonwebtoken');


// ================
//  Verificar Token
//  ===============

let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token Invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


};


// ================
//  Verificar Role
//  ===============

let verificarAdminRole = (req, res, next) => {

    let usuario = req.usuario;


    if (usuario && usuario.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'No cuenta con los permisos para realizar esta acción'
            }
        });
    }

    next();


};


module.exports = {
    verificarToken,
    verificarAdminRole
};