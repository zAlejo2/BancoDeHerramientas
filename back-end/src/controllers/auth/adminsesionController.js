import { format } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { AdminSesion } from '../../models/index.js';

const now = new Date();
const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss', { locale: es });

const nuevaSesion = (documento) => AdminSesion.create({
    administradores_documento: documento,
    login: formattedDate
});

const terminarSesion = async (documento) => {
    try {
      // Encuentra la última sesión activa de este administrador
      const sesion = await AdminSesion.findOne({
        where: {
          administradores_documento: documento,
          logout: null // Asegúrate de que estamos actualizando la sesión que no se ha cerrado aún
        },
        order: [['login', 'DESC']] // Ordena por la más reciente
      });
  
      if (sesion) {
        // Actualiza el campo `logout` con la fecha y hora actuales
        sesion.logout = formattedDate;
        await sesion.save();
      } else {
        console.log('No se encontró una sesión activa para este administrador.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  export {nuevaSesion, terminarSesion}