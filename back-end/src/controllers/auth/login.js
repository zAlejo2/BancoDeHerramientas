import bcrypt from 'bcryptjs';
import { Administrador, Cliente, Rol } from '../../models/index.js';
import generarToken from '../../helpers/tokenHelper.js';
import {nuevaSesion} from './adminsesionController.js';

//Login 
const login = async (req, res) => {

    const { documento, contrasena } = req.body;
  
    try {

      const admin = await Administrador.findOne({ where: { documento } });
      const client = await Cliente.findOne({ where: { documento } });

      if(admin) {

        const isAdminMatch = await bcrypt.compare(contrasena, admin.contrasena);

        if (!isAdminMatch) {

          return res.status(401).json({ message: 'Contraseña incorrecta' });

        } else {

          const id = admin.documento;
          const type = 'administrador';
          const role = admin.tipo;
          const area = admin.areas_idarea;

          nuevaSesion(documento);

          const token = generarToken(id, type, role, area);

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

          const roles_idrol = client.roles_idrol; 

          const obtenerDescripcion = await Rol.findOne({
            where: { idrol: roles_idrol },
            attributes: ['descripcion']
          });

          const id = client.documento;
          const type = 'cliente';
          const role = obtenerDescripcion ? obtenerDescripcion.descripcion : null;

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
      
    } catch (error) {

      res.status(500).json({ message: 'Error en el login', error });

    }
  };

  export default login;