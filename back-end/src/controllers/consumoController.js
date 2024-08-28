import { Consumo, ElementoHasConsumo, Cliente, Elemento } from '../models/index.js';
import { ajustarHora } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createConsumption = async (req, res) => {
    try {
        const { documento, elementos } = req.body;
        const cliente = await Cliente.findOne({ where: {documento}});
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado'});
        }
        const consumo = await Consumo.create({
            clientes_documento: cliente.documento
        });

        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: 'La cantidad de consumo debe ser mayor a 0'});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento, estado: 'disponible' }});
            if(!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con  el ID ${idelemento} no encontrado o agotado, revise inventrio`});
            }

            if(elementoEncontrado.disponibles < cantidad) {
                return res.status(400).json({ mensaje: `No hay suficientes elementos del ID ${idelemento} para hacer el consumo`});
            }

            await ElementoHasConsumo.create({
                elementos_idelemento: idelemento,
                consumos_idconsumo: consumo.idconsumo,
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

        res.status(201).json({ mensaje: 'Consumo registrado con éxito', consumo});
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al rgistrar consumo: ', error});
    }
};

const updateConsumption = async (req, res) => {
    try {
        // const updated = 
    } catch (error) {}
}

const changeToLoan = async (req, res) => {
    try {

    } catch (error) {}
};

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

export { createConsumption,  deleteConsumption};