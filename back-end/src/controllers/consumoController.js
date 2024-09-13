import { Consumo, ElementoHasConsumo, Cliente, Elemento } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

// CREAR CONSUMO
const createConsumption = async (req, res) => {
    try {
        const { area, id: adminId } = req.user;  // Extraemos el área y el adminId de req.user
        const { documento } = req.body;

        const cliente = await Cliente.findOne({ where: { documento } });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const consumo = await Consumo.create({
            clientes_documento: cliente.documento,
            areas_idarea: area
        });
        
        const idconsumo = consumo.idconsumo;

        return res.status(200).json({idconsumo});

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al crear préstamo: ', error });
    }
};

// AGREGAR ELEMENTOS AL CONSUMO 
const addElements = async (req, res) => {
    try {

        const { idconsumo } = req.params;
        const { elementos } = req.body;
        const { area, id: adminId } = req.user;

        const consumo = await Consumo.findOne({ where: { idconsumo } });

        if (!consumo) {
            return res.status(404).json({ mensaje: 'Consumo no encontrado' });
        }

        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento , areas_idarea: area}});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
            }

            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible', areas_idarea: area }});

            if(!elementoDisponible) {
                return res.status(400).json({ mensaje: `El elemento con el id ${idelemento} se encuentra agotado`})
            }

            if (dispoTotal < cantidad) {
                return res.status(400).json({ mensaje: `No hay suficientes elementos del ID ${idelemento} para hacer el consumo, revise mínimos en el inventario` });
            }

            await ElementoHasConsumo.create({
                elementos_idelemento: idelemento,
                consumos_idconsumo: idconsumo,
                cantidad,
                observaciones,
                fecha: obtenerHoraActual()
            });

            await Elemento.update(
                {
                    disponibles: elementoEncontrado.disponibles - cantidad,
                    estado: elementoEncontrado.disponibles - cantidad <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                },
                { where: { idelemento } }
            );
        }
        return res.status(201).json({ mensaje: 'Elementos agregados al consumo con éxito' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar elementos al consumo: ', error });
    }
};

// ELIMINAR CONSUMO
const deleteConsumption = async (req,res) => {
    try {
        const deleted = await Consumo.destroy ({
            where: { idconsumo: req.params.idconsumo }
        });
        if(deleted) {
            res.status(201).json({ mensaje: 'Consumo eliminado correctamente'});
        } else {
            res.status(404).json({ mensaje: 'Consumo no encontrado'});
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el registro de Consumo' });
    }
};

const getAllConsumptions = async (req, res) => {
    try {
        const { area, id: adminId } = req.user;
        const consumos = await ElementoHasConsumo.findAll({
            include: [
              {
                model: Consumo,
                include: [
                  {
                    model: Cliente,  
                    attributes: ['documento', 'nombre', 'roles_idrol']
                  }
                ],
                attributes: ['idconsumo', 'clientes_documento']  
              },
              {
                model: Elemento,
                where: { areas_idarea: area },  
                attributes: ['idelemento', 'descripcion']
              }
            ]
          });
        const consumoFormateado = consumos.map(consumo => {
            const fechaAccion = formatFecha(consumo.fecha, 5);
            return {
              ...consumo.dataValues,
              fecha: fechaAccion,
            };
          });
      
          res.json(consumoFormateado); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'error al obtener el historial', error})
    }
}


export { createConsumption, getAllConsumptions, addElements, deleteConsumption};