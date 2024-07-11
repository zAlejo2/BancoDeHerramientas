import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const secret = config.jwt.secret;

// Función para crear un token
export const createToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
};

