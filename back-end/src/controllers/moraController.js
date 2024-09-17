import { Mora } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const tiempoMora = (fecha) => {
    // Obtener la fecha actual
    const fechaActual = obtenerHoraActual();
    
    // Convertir la fecha pasada a un objeto de tipo Date
    const fechaInicial = new Date(fecha);
  
    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = fechaActual - fechaInicial;
  
    // Convertir la diferencia de milisegundos a días (1 día = 24 * 60 * 60 * 1000 ms)
    const diasDiferencia = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  
    return diasDiferencia;
}
  
const createMora = async (cantidad, observaciones, idelemento, documento) => {
    await Mora.create({
        cantidad: cantidad,
        fecha: obtenerHoraActual(),
        observaciones: observaciones,
        tiempoMora: tiempoMora(fecha),
        elementos_idelemento: idelemento,
        clientes_documento: documento
    })
}

export { createMora };

// nombre User, cedula, codigo GroupIcon, codigo Elementos, descripcion, cantidad, observaciones, fecha, tiempo en mora