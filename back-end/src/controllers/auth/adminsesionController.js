import { format } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { AdminSesion } from '../../models/index.js';

const now = new Date();
const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss', { locale: es });

const nuevaSesion = (documento) => AdminSesion.create({
    administradores_documento: documento,
    login: formattedDate
});

export default nuevaSesion;