import { Consumo, ElementoHasConsumo, Cliente, Elemento } from '../models/index.js';
import { ajustarHora } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createConsumption = async (req, res) => {
    try {
        const { documento } = req.body;
        const cliente = await Cliente.findOne({ where: { documento } });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const consumo = await Consumo.create({
            clientes_documento: cliente.documento
        });

        res.status(201).json({ mensaje: 'Consumo creado con éxito', consumo });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear consumo: ', error });
    }
};

const addOrUpdate = async (req, res) => {
    try {
        // TENER EN CUENTA EL CONTROL DE MINIMOS Y QUE EL ELEMENTO SE ENCUENTRE DIPONIBLE PARA QUE FUNCIONE, ACTUALMENTE FALTA ESO
        const { idconsumo } = req.params;
        const { elementos } = req.body;

        const consumo = await Consumo.findOne({ where: { idconsumo } });

        if (!consumo) {
            return res.status(404).json({ mensaje: 'Consumo no encontrado' });
        }

        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            const elementoEnConsumo = await ElementoHasConsumo.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    consumos_idconsumo: idconsumo
                }
            });

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con ID ${idelemento} no encontrado` });
            }

            if(elementoEnConsumo) {

                const diferencia = elementoEnConsumo.cantidad - cantidad;

                await ElementoHasConsumo.update(
                    { cantidad: cantidad, observaciones: observaciones},
                    { where: { elementos_idelemento: idelemento, consumos_idconsumo: idconsumo } }
                );

                await Elemento.update(
                    {
                        disponibles: elementoEncontrado.disponibles + diferencia,
                        estado: elementoEncontrado.disponibles + diferencia <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                ); 

            } else {

                if (elementoEncontrado.disponibles < cantidad) {
                    return res.status(400).json({ mensaje: `No hay suficientes elementos del ID ${idelemento} para hacer el consumo` });
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
        }

        return res.status(201).json({ mensaje: 'Elementos agregados al consumo y actualizados con éxito' });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar elementos al consumo: ', error });
    }
};

const deleteConsumption = async (req,res) => {
    try {
        const deleted = await Consumo.destroy ({
            where: { idconsumo: req.body.idconsumo }
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

const getAllConsumtions = async (req, res) => {
    try {
        const consumos = await ElementoHasConsumo.findAll(/*{group: ['consumos_idconsumo']}*/);
        res.json(consumos);
    } catch(error) {
        res.status(500).json({ mesaje: 'Error al obtener los consumos: ', error });
    }
};

const getConsumptionById = async (req, res) => {
    const {idconsumo} = req.params;
    try {
        const consumo = await ElementoHasConsumo.findAll({ where: { consumos_idconsumo: idconsumo }});
        if(consumo) {
            res.json(consumo);
        } else {
            res.status(404).json({ mensaje: `No existe consumo con el id ${req.params.idconsumo}`})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al obtener el consumo: ', error});
    }
};

export { createConsumption, getAllConsumtions, getConsumptionById, addOrUpdate, deleteConsumption};