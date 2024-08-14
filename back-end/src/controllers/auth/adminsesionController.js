import { format } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { AdminSesion } from '../../models/index.js';

const ajustarHora = (date) => {
  const offset = -5; // Esto es para cuadrar las horas manualmente porque en la bd se están guardando las hroas con un desface de 5 horas
  const adjustedDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return format(adjustedDate, 'yyyy-MM-dd HH:mm:ss', { locale: es });
};

const obtenerHoraActual = () => ajustarHora(new Date());

const nuevaSesion = (documento) => AdminSesion.create({
    administradores_documento: documento,
    login: obtenerHoraActual()
});

const terminarSesion = async (documento) => {
    try {
        const sesion = await AdminSesion.findOne({
            where: {
                administradores_documento: documento,
                logout: null
            },
            order: [['login', 'DESC']]
        });

        if (sesion) {
            sesion.logout = obtenerHoraActual();
            await sesion.save();
        } else {
            console.log('No se encontró una sesión activa para este administrador.');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};

export { nuevaSesion, terminarSesion };
