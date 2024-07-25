import bcrypt from 'bcryptjs';
import Administrador from '../../models/administradorModel.js';
import { generarToken } from '../../helpers/tokenHelper.js';

//Login de administrador
export const loginAdmin = async (req, res) => {
    const { documento, contrasena } = req.body;
  
    try {
      const admin = await Administrador.findOne({ where: { documento } });
      if (!admin) {
        return res.status(401).json({ message: 'Administrador no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      //Llamado al Helper
      const token = generarToken(admin);

      res.send({
        documento: admin.documento,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Error en el login', error });
    }
  };