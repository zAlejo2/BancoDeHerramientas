import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const secret = config.jwt.secret;

// Middleware para verificar el token JWT
const authenticate = (req, res, next) => {

  if (req.header('Authorization') == undefined) {
    return res.status(401).json({ message: 'Debes Iniciar Sesión para acceder a este sitio' });
  } 
    
  const token = req.header('Authorization').replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'No puedes acceder a este sitio, inténtalo mas tarde' });
  }
};

const verifyType = (tipoPermitido) => {
  return (req, res, next) => {
    const { type } = req.user;

    if (tipoPermitido.includes(type)) {
      next();
    } else {
      res.status(403).json({ message: 'Este tipo de usuario no tiene autorización' });
    }
  };
};

const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (rolesPermitidos.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado, no tienes el rol adecuado' });
    }
  };
};

export {authenticate, verifyType, verifyRole};


