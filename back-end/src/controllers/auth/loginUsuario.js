import bcrypt from 'bcryptjs';
import Usuario from '../../../models/index.js';
import createToken from '../../authController.js';

// login de Usuario
export const loginUser = async (req, res) => {
    const { documento, password } = req.body;
  
    try {
      const user = await Usuario.findOne({ where: { documento } });
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      const token = createToken({ id: user.id, role: 'user' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error en el login', error });
    }
  };