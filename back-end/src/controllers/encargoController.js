import { id } from 'date-fns/locale';
import { Encargo, ElementoHasEncargo, Cliente, Elemento, Mora, Dano, Area } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { recordConsumption } from './consumoController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

// INSTRUCTOR CREA EL ENCARGO
const createEncargo = async (req, res) => {
    try {
        const {id: clientes_documento } = req.user;
        const { correo, numero, elementos, fecha_reclamo, areas_idarea } = req.body;
        const clienteExists = await Cliente.findOne({where: {documento: clientes_documento}});
        if (!clienteExists) {
            return res.status(400).json({ mensaje: 'La persona no se encuentra registrada'})
        }

        if (!numero || !correo || !fecha_reclamo || !elementos) {
            return res.status(400).json({ mensaje: 'Debes ingresar todos los datos'})
        }
        // esta constante debe ir después de la validación de arriba porque sino saldrá error de 'Invalid time value' al intentar ajustar la hora en caso de que no se haya indicado la fecha desde el front y sea undefined
        const fechaReclamo = ajustarHora(new Date(fecha_reclamo)); 

        const existeEncargo = await Encargo.findOne({where: {clientes_documento: clientes_documento}});

        const encargo = await Encargo.create({
            clientes_documento: clientes_documento,
            correo: correo,
            numero: numero,
            areas_idarea: areas_idarea,
            fecha_pedido: obtenerHoraActual(),
            fecha_reclamo: fechaReclamo
        });

        const idencargo = encargo.idencargo;
        
        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento, areas_idarea: areas_idarea }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento no encontrado en el inventario` });
            }
            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            if (existeEncargo) {
                const elementoYaEncargado = await ElementoHasEncargo.findOne({where: {encargos_idencargo: existeEncargo.idencargo, elementos_idelemento: idelemento}});
                if (elementoYaEncargado) {
                    return res.status(400).json({ mensaje: `Ya tienes el elemento ${elementoEncontrado.descripcion} encargado`});
                }
            }

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad de préstamo no puede ser 0 ni menor que éste`});
            }
        
            const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible', areas_idarea: areas_idarea }});
            if (!elementoDisponible) {
                return res.status(404).json({ mensaje: `Elemento ${elementoDisponible.descipcion} agotado` });
            }

            if (dispoTotal < cantidad) {
                return res.status(400).json({ mensaje: `La cantidad solicitada del elemento ${elementoDisponible.descipcion} supera la disponibilidad de éste, revise mínimos en el inventario` });
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
        const { elemento } = req.body; 

        const encargo = await ElementoHasEncargo.findOne({ where: {encargos_idencargo: idencargo, elementos_idelemento: elemento}});  
        if (!encargo) {
            return res.status(400).json({ mensaje: 'El encargo que intenta cancelar no existe'});
        }
        if (encargo.estado == 'aceptado') {
            return res.status(400).json({ mensaje: 'El encargo ya fue aceptado por el banco de herramientas, no puedes cancelarlo, por favor recarga la página'})
        }
        await ElementoHasEncargo.destroy({ where: {encargos_idencargo: idencargo, elementos_idelemento: elemento}});
        const encargos = await ElementoHasEncargo.findAll({ where: {encargos_idencargo: idencargo}});
        if (encargos.length<1) {
            await Encargo.destroy({where: {idencargo: idencargo}});
        }

        res.status(200).json({mensaje: 'Encargo cancelado correctamente'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al cancelar el encargo, por favor vuleva a intentarlo' });
    }
};

// PARA OBTENER LOS PRESTAMOS ACTIVOS
const getInstructorEncargos = async (req, res) => {
    try {
        const { id: clientes_documento } = req.user;
        const encargos = await ElementoHasEncargo.findAll({
            include: [
                {
                    model: Encargo,
                    attributes: ['areas_idarea', 'fecha_reclamo'],
                    where: { clientes_documento: clientes_documento },
                    include: [
                        {
                            model: Area, // Asegúrate de que el modelo Area esté importado
                            attributes: ['nombre'] // Cambia 'nombre' por el campo que necesitas
                        }
                    ]
                },
                {
                    model: Elemento,
                    attributes: ['descripcion']
                }
            ]
        });

        const encargosFormateados = encargos.map(encargo => {
            const fechaReclamo = formatFecha(encargo.Encargo.fecha_reclamo, 5); // Asegúrate de acceder a la fecha correctamente
            return {
                ...encargo.dataValues, // Cambia 'prestamo' por 'encargo'
                fecha_reclamo: fechaReclamo,
                area_nombre: encargo.Encargo.Area.nombre // Accediendo al nombre del área
            };
        });

        return res.status(200).json(encargosFormateados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los encargos' });
    }
};
    

export { createEncargo, cancelEncargo, getInstructorEncargos };