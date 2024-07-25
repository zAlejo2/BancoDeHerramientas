import jwt from 'jsonwebtoken';

export const generarToken = (admin) => {
    //Objeto para codificar
    const adminForToken = {
        documento: admin.documento,
        nombre: admin.nombre
    }

    //Firmamos
    return jwt.sign(adminForToken, 'Token-Auth', { expiresIn: '1h' });
}