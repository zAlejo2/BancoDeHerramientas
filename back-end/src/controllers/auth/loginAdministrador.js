import bcrypt from 'bcryptjs';
import Administrador from '../../../models/index.js';
import createToken from '../../authController.js';

// login de administrador
export const loginAdmin = async (req, res) => {
    const { documento, password } = req.body;
  
    try {
      const admin = await Administrador.findOne({ where: { documento } });
      if (!admin) {
        return res.status(401).json({ message: 'Administrador no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      const token = createToken({ id: admin.id, role: 'admin' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error en el login', error });
    }
  };