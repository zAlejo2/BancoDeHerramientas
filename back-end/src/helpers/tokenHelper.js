import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generarToken = (admin) => {
    //Objeto para codificar
    const adminForToken = {
        documento: admin.documento,
        nombre: admin.nombre
    }

    //Firmamos
    return jwt.sign(adminForToken, config.jwt.secret, { expiresIn: '1h' });
}