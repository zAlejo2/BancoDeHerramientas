import { Mora, Cliente, Elemento } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';

const obtenerHoraActual = () => ajustarHora(new Date());
  
const createMora = async (cantidad, observaciones, idelemento, documento, area) => {
    const mora= await Mora.create({
        cantidad: cantidad,
        fecha: obtenerHoraActual(),
        observaciones: observaciones,
        elementos_idelemento: idelemento,
        clientes_documento: documento,
        areas_idarea: area
    })
    return mora;
}

const returnMora = async (req, res) => {
    const { area, adminId } = req.user;
    const { idmora, idelemento, cantidad } = req.body;
    const elemento = await Elemento.findOne({where: {idelemento: idelemento}})
    await Elemento.update(
        {
            disponibles: elemento.disponibles + cantidad,
            estado: elemento.disponibles + cantidad <= elemento.minimo ? 'agotado' : 'disponible'
        },
        { where: { idelemento } }
    );
    await Mora.destroy({
        where: {
            idmora: idmora,
            elementos_idelemento: idelemento
        }
    })
    // createRecord(area, 'mora', idmora, adminId, prestamo.clientes_documento, idelemento, cantidadNueva, observaciones, 'mora', 'ENVIAR A MORA');
}

const getAllMoras = async (req, res) => {
    try {
        const { area } = req.user;
        const moras = await Mora.findAll({
            include: [
              {
                model: Elemento,
                where: { areas_idarea: area },  
                attributes: ['idelemento', 'descripcion']
              },
              {
                model: Cliente,
                attributes: ['documento', 'nombre', 'roles_idrol']
              }
            ]
          });
        const moraFormateada = moras.map(mora => {
            const fechaAccion = formatFecha(mora.fecha, 5);
            return {
              ...mora.dataValues,
              fecha: fechaAccion
            };
          });
      
          res.json(moraFormateada); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'error al obtener las moras', error})
    }
}

export { createMora, getAllMoras, returnMora };

// nombre User, cedula, codigo GroupIcon, codigo Elementos, descripcion, cantidad, observaciones, fecha, tiempo en mora