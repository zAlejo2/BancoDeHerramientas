import { Historial } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createRecord = async (areaId, tipoEntidad, entidadId, adminId, clienteId, elementoId, Cantidad, Observaciones, Estado, Accion) => {
    try{

        await Historial.create({
            area_id: areaId,
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
        console.log('historial creado')
    } catch(error) {
        console.log(error)
    }      
};

const getAllRecord = async (req, res) => {
    try {
        const area = req.area; 
        const historial = await Historial.findAll({where: { area_id: area }})
        return res.status(200).json({historial})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'error al obtener el historial', error})
    }
}

export { getAllRecord, createRecord};