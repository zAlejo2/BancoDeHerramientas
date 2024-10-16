import { id } from 'date-fns/locale';
import { Encargo, ElementoHasEncargo, Cliente, Elemento, Mora, Dano } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { recordConsumption } from './consumoController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

// INSTRUCTOR CREA EL ENCARGO
const createEncargo = async (req, res) => {
    try {
        const {id: clientes_documento } = req.user;
        const { correo, numero, elementos, areas_idarea, fecha_reclamo } = req.body;
        const clienteExists = await Cliente.findOne({where: {documento: clientes_documento}});
        if (!clienteExists) {
            return res.status(400).json({ mensaje: 'La persona no se encuentra registrada'})
        }

        const encargo = await Encargo.create({
            clientes_documento: clientes_documento,
            correo: correo,
            numero: numero,
            areas_idarea: areas_idarea,
            fecha_pedido: obtenerHoraActual(),
            fecha_reclamo: fecha_reclamo
        });

        const idencargo = encargo.idencargo;
        
        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento, areas_idarea: areas_idarea }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
            }
            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad de préstamo no puede ser 0 ni menor que éste`});
            }
        
            const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible', areas_idarea: areas_idarea }});
            if (!elementoDisponible) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} agotado` });
            }

            if (dispoTotal < cantidad) {
                return res.status(400).json({ mensaje: `La cantidad solicitada del elemento con el ID ${idelemento} supera la disponibilidad de éste, revise mínimos en el inventario` });
            }

            await ElementoHasEncargo.create({
                elementos_idelemento: idelemento,
                encargos_idencargo: idencargo,
                cantidad,
                observaciones,
                estado: 'pendiente'
            });
        }

        return res.status(200).json({ mensaje: 'Encargo creado con éxito' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al crear el encargo, por favor vuelva a intentarlo'});
    }
};

// INSTRUCTOR PUEDE CANCELAR ENCARGO SI AÚN ESTABA PENDIENTE
const cancelEncargo = async (req, res) => {
    try {
        const { idencargo } = req.params;
        const encargo = ElementoHasEncargo.findOne({ where: {encargos_idencargo: idencargo}});
        if (!encargo) {
            return res.status(400).json({ mensaje: 'El encargo que intenta cancelar no existe'});
        }
        if (encargo.estado == 'aceptado') {
            return res.status(400).json({ mensaje: 'El encargo ya fue aceptado por el banco de herramientas, no puedes cancelarlo'})
        }
        await ElementoHasEncargo.destroy({ where: {encargos_idencargo: idencargo}});
        const encargos = await ElementoHasEncargo.findAll({ where: {encargos_idencargo: idencargo}});
        
        if (encargos.length<1) {
            await Encargo.destroy({where: {idencargo: idencargo}});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al cancelar el encargo, por favor vuleva a intentarlo' });
    }
};

// PARA OBTENER LOS PRESTAMOS ACTIVOS
const getInstructorEncargos = async (req, res) => {
    try {
        const { id: clientes_documento } = req.user;
        const encargos = await Encargo.findAll({
        include: [
          {
            model: ElementoHasEncargo,
            attributes: ['elementos_idelemento', 'cantidad', 'observaciones', 'estado']
          },  
          {
            model: Elemento,
            attributes: ['descripcion']
          }
        ],
        where: {clientes_documento: clientes_documento}
      });

      const encargosFormateados = encargos.map(encargo => {
        const fechaPedido = formatFecha(encargo.fecha_pedido, 5);
        const fechaReclamo = formatFecha(encargo.fecha_reclamo, 5);
        return {
          ...prestamo.dataValues,
          fecha_pedido: fechaPedido,
          fecha_reclamo: fechaReclamo,
        };
      });
  
      return res.status(200).json(encargosFormateados); 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener los encargos' });
    }
};    

export { createEncargo, cancelEncargo, getInstructorEncargos };