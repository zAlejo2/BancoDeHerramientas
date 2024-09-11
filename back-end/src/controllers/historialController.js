import { Historial } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createRecord = async (tipoEntidad, entidadId, adminId, clienteId, elementoId, Cantidad, Observaciones, Estado, Accion) => {
    try{

        const historial = await Historial.create({
            tipo_entidad: tipoEntidad, 
            entidad_id: entidadId,
            admin_id: adminId,
            cliente_id: clienteId,
            elemento_id: elementoId,
            cantidad: Cantidad,
            observaciones: Observaciones,
            estado: Estado,
            accion: Accion,
            fecha_accion: obtenerHoraActual()
        });
        console.log('creado')
        // return json(historial)
    } catch(error) {
        console.log(error)
        // return json(error)
    }      
};

export default createRecord;