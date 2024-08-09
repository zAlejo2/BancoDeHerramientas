import {terminarSesion} from './adminsesionController.js';

const logout = async (req, res) => {
    const { documento } = req.body;
  
    try {
      // Registra el cierre de sesión
      await terminarSesion(documento);
  
      // Envía una respuesta al cliente
      res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
};

export default logout;
