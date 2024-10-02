import { Baja, Cliente, Elemento } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

