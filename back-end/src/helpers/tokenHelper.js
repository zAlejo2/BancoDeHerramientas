import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function generarToken(userId, userType, userRole) {
    const payload = {
        id: userId,
        type: userType,
        role: userRole
    };

    let expiresIn;
    if(userType === 'administrador') {
        expiresIn = '12h';
    } else if (userType === 'cliente') {
        expiresIn = '1h';
    } else {
        expiresIn = '1h';
    }

    const secretKey = config.jwt.secret;

    return jwt.sign(payload, secretKey, {expiresIn});
}

export default generarToken;

// export const generarToken = (admin) => {
//     //Objeto para codificar
//     const adminForToken = {
//         documento: admin.documento,
//         nombre: admin.nombre
//     }

//     //Firmamos
//     return jwt.sign(adminForToken, config.jwt.secret, { expiresIn: '1h' });
// }