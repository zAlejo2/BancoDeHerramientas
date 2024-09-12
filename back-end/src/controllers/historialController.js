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
        const historiales = await Historial.findAll({where: { area_id: area }});
        const historialFormateado = historiales.map(historial => {
            const fechaAccion = formatFecha(historial.fecha_accion, 5);
            return {
              ...historial.dataValues,
              fecha_accion: fechaAccion,
            };
          });
      
          res.json(historialFormateado); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'error al obtener el historial', error})
    }
}

export { getAllRecord, createRecord};