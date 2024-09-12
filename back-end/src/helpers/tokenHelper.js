import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function generarToken(userId, userType, userRole, areaId) {
    
    const payload = {
        id: userId,
        type: userType,
        role: userRole,
        area: areaId
    };

    const expiresIn = userType === 'administrador' ? '12h' : '1h';

    const secretKey = config.jwt.secret;

    return jwt.sign(payload, secretKey, {expiresIn});
}

export default generarToken;