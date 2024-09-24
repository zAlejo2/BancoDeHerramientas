import { Dano, Cliente, Elemento } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';

const obtenerHoraActual = () => ajustarHora(new Date());
  
const createDano = async (cantidad, observaciones, idelemento, documento, area) => {
    const dano= await Dano.create({
        cantidad: cantidad,
        fecha: obtenerHoraActual(),
        observaciones: observaciones,
        elementos_idelemento: idelemento,
        clientes_documento: documento,
        areas_idarea: area
    })
    return dano;
}

const returnDano = async (req, res) => {
  try {
    const { area, id: adminId } = req.user;
    const { iddano, idelemento, cantidad, observaciones, documento } = req.body;
    const elemento = await Elemento.findOne({where: {idelemento: idelemento}})
    await Elemento.update(
        {
            disponibles: elemento.disponibles + cantidad,
            estado: elemento.disponibles + cantidad <= elemento.minimo ? 'agotado' : 'disponible'
        },
        { where: { idelemento } }
    );
    await Dano.destroy({
        where: {
            iddano: iddano,
            elementos_idelemento: idelemento
        }
    })
    createRecord(area, 'daño', iddano, adminId, documento, idelemento, cantidad, observaciones, 'finalizado', 'REPONER ELEMENTO DAÑADO');
    return res.status(200).json({ mensaje: 'elementos regresados'})
  } catch (error) { 
    console.log(error); 
    return res.status(500).json({ mensaje: 'Error al reponer el elemento'})
  }
}

const getAllDanos = async (req, res) => {
    try {
        const { area } = req.user;
        const danos = await Dano.findAll({
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
        const danoFormateado = danos.map(dano => {
            const fechaAccion = formatFecha(dano.fecha, 5);
            return {
              ...dano.dataValues,
              fecha: fechaAccion
            };
          });
      
          res.json(danoFormateado); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'Error al obtener los datos'})
    }
}

export { createDano, getAllDanos, returnDano };

// nombre User, cedula, codigo GroupIcon, codigo Elementos, descripcion, cantidad, observaciones, fecha, tiempo en dano