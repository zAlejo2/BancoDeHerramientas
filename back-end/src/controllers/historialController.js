import { Historial, Cliente, Elemento } from '../models/index.js';
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
    } catch(error) {
        console.log(error)
    }      
};

const getAllRecord = async (req, res) => {
    try {
        const area = req.area; 
        const historiales = await Historial.findAll({ where: { area_id: area } });

        const historialFormateado = await Promise.all(historiales.map(async (historial) => {
            // Consulta el nombre del cliente
            const cliente = await Cliente.findOne({
                where: { documento: historial.cliente_id }, // Cambia 'id' por el campo que corresponda a la clave primaria de cliente
                attributes: ['nombre'], // Solo traemos el nombre
            });

            // Consulta el nombre del elemento
            const elemento = await Elemento.findOne({
                where: { idelemento: historial.elemento_id }, // Cambia 'id' por el campo que corresponda a la clave primaria de elemento
                attributes: ['descripcion'], // Solo traemos el nombre
            });

            const fechaAccion = formatFecha(historial.fecha_accion, 5);

            return {
                ...historial.dataValues,
                cliente_nombre: cliente ? cliente.nombre : 'Desconocido', // Añade el nombre del cliente
                elemento_nombre: elemento ? elemento.descripcion : '', // Añade el nombre del elemento
                fecha_accion: fechaAccion,
            };
        }));

        res.json(historialFormateado); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error al obtener el historial', error });
    }
};


export { getAllRecord, createRecord};