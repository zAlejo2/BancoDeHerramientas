import bcrypt from 'bcryptjs';
import {Administrador, Cliente} from '../../models/index.js';
import generarToken from '../../helpers/tokenHelper.js';

//Login de administrador
export const loginAdmin = async (req, res) => {
    const { documento, contrasena } = req.body;
  
    try {
      const admin = await Administrador.findOne({ where: { documento } });
      const client = await Cliente.findOne({ where: { documento } });

      if(admin) {
        const isAdminMatch = await bcrypt.compare(contrasena, admin.contrasena);
        if (!isAdminMatch) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        } else {
          let id = admin.documento;
          let type = 'administrador';
          let role = admin.tipo;
          const token = generarToken(id, type, role);
          res.send({
            documento: id,
            tipo: type,
            token
          });
        }
      } else if (client) {
        const isClientMatch = await bcrypt.compare(contrasena, client.contrasena);
        if (!isClientMatch) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        } else { 
          let id = client.documento;
          let type = 'cliente';
          let role = client.roles_idrol;
          const token = generarToken(id, type, role);
          res.send({
            documento: id,
            tipo: type,
            token
          });
        }
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // const admin = await Administrador.findOne({ where: { documento } });
      // if (!admin) {
      //   return res.status(401).json({ message: 'Administrador no encontrado' });
      // } 
  
      // const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
      // if (!isMatch) {
      //   return res.status(401).json({ message: 'Contraseña incorrecta' });
      // }

      //Llamado al Helper
      // const token = generarToken(id, type, role);

      // res.send({
      //   documento: id,
      //   token
      // });
    } catch (error) {
      res.status(500).json({ message: 'Error en el login', error });
    }
  };