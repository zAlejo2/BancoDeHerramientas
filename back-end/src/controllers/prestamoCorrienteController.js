import { PrestamoCorriente, ElementoHasPrestamoCorriente, Cliente, Elemento } from '../models/index.js';
import { ajustarHora } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createLoan = async (req, res) => {
    try {
        const { documento } = req.body;
        const cliente = await Cliente.findOne({ where: { documento } });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const loanExisting = await PrestamoCorriente.findOne({ where: { clientes_documento: documento, estado: 'actual' } });
        if (loanExisting) {
            let idprestamo = loanExisting.idprestamo;
            return res.status(200).json({ idprestamo})
        }

        const prestamo = await PrestamoCorriente.create({
            clientes_documento: cliente.documento,
            estado: 'actual'
        });

        let idprestamo = prestamo.idprestamo;

        return res.status(200).json({ idprestamo, elementos: [] });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear consumo: ', error });
    }
};

const findLoanElements = async (req, res) => {
    const { idprestamo } = req.params;

    const loanExisting = await PrestamoCorriente.findOne({ where: { idprestamo: idprestamo, estado: 'actual' } });
    if (loanExisting) {
        let idprestamo = loanExisting.idprestamo;
        const loanElements = await ElementoHasPrestamoCorriente.findAll({ where: { prestamoscorrientes_idprestamo: idprestamo }});
        const elementosEnPrestamo = loanElements.map(async loanElement => {
            const { elementos_idelemento, cantidad, observaciones, fecha_entrega } = loanElement;
            const elemento = await Elemento.findOne({ where: { idelemento: elementos_idelemento}});
            return { elemento, cantidad, observaciones, fecha_entrega };
        });

        const elementos = await Promise.all(elementosEnPrestamo);

        return res.status(200).json({ idprestamo, elementos });
    }
};

const addOrUpdate = async (req, res) => {
    try {

        const { idprestamo } = req.params;
        const { elementos } = req.body;

        const prestamo = await PrestamoCorriente.findOne({ where: { idprestamo } });

        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
        }
        
        const elementosExistentes = await ElementoHasPrestamoCorriente.findAll({
            where: { prestamoscorrientes_idprestamo: idprestamo }
        });

        const idsDelBody = elementos.map((elemento) => elemento.idelemento);

        for (let elementoExistente of elementosExistentes) {
            if (!idsDelBody.includes(elementoExistente.elementos_idelemento)) {
                const cantidadEliminar = elementoExistente.cantidad;

                const elemento = await Elemento.findOne({ where: { idelemento: elementoExistente.elementos_idelemento } });
                
                await Elemento.update(
                    {
                        disponibles: elemento.disponibles + cantidadEliminar,
                        estado: elemento.disponibles + cantidadEliminar <= elemento.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento: elementoExistente.elementos_idelemento } }
                );

                await ElementoHasPrestamoCorriente.destroy({
                    where: {
                        prestamoscorrientes_idprestamo: idprestamo,
                        elementos_idelemento: elementoExistente.elementos_idelemento
                    }
                });
            }
        }

        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            const elementoEnPrestamo = await ElementoHasPrestamoCorriente.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo
                }
            });

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
            }

            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible' }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado o agotado, revise inventario` });
            }

            if(elementoEnPrestamo) {

                const dispoTotalUpdate = dispoTotal + elementoEnPrestamo.cantidad;

                if((dispoTotalUpdate < cantidad) && (cantidad > elementoEnPrestamo.cantidad)) {
                    return res.status(400).json({ mensaje: `No hay más elementos disponibles con el id ${idelemento} para consumir`}) 
                } 

                const diferencia = elementoEnPrestamo.cantidad - cantidad;

                await ElementoHasPrestamoCorriente.update(
                    { cantidad: cantidad, observaciones: observaciones},
                    { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                );

                await Elemento.update(
                    {
                        disponibles: elementoEncontrado.disponibles + diferencia,
                        estado: elementoEncontrado.disponibles + diferencia <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                ); 

            } else {

                if(!elementoDisponible) {
                    return res.status(400).json({ mensaje: `El elemento con el id ${idelemento} se encuentra agotado`})
                }

                if (dispoTotal < cantidad) {
                    return res.status(400).json({ mensaje: `No hay suficientes elementos del ID ${idelemento} para hacer el consumo, revise mínimos en el inventario` });
                }

                await ElementoHasPrestamoCorriente.create({
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo,
                    cantidad,
                    observaciones,
                    fecha_entrega: obtenerHoraActual(),
                    estado: 'actual'
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

        return res.status(201).json({ mensaje: 'Elementos agregados al prestamo y actualizados con éxito' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al agregar y actualizar elementos al prestamo: ', error });
    }
};

const deleteLoan = async (req, res) => {
    try {
        const deleted = await PrestamoCorriente.destroy ({
            where: { idprestamo: req.params.idprestamo }
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

const returnItem = async (req, res) => {
    try {
        const { idprestamo, idelemento, cantidad } = req.body;

        const prestamo = await PrestamoCorriente.findByPk(idprestamo);
        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }

        const elementoPrestamo = await ElementoHasPrestamoCorriente.findOne({
            where: {
                elementos_idelemento: idelemento,
                prestamoscorrientes_idprestamo: idprestamo
            }
        });

        if (!elementoPrestamo) {
            return res.status(404).json({ mensaje: 'El elemento no está asociado con este préstamo' });
        }

        if (cantidad > elementoPrestamo.cantidad) {
            return res.status(400).json({ mensaje: 'La cantidad a devolver no puede ser mayor que la cantidad prestada' });
        }

        const elemento = await Elemento.findOne({ where: { idelemento } });
        if (!elemento) {
            return res.status(404).json({ mensaje: `Elemento con ID ${idelemento} no encontrado` });
        }

        await Elemento.update(
            {
                disponibles: elemento.disponibles + cantidad,
                estado: elemento.disponibles + cantidad > elemento.minimo ? 'disponible' : 'agotado'
            },
            { where: { idelemento } }
        );

        if (cantidad === elementoPrestamo.cantidad) {
            await ElementoHasPrestamoCorriente.update(
                { estado: 'finalizado' },
                { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
            );
        } else {
            await ElementoHasPrestamoCorriente.update(
                { cantidad: elementoPrestamo.cantidad - cantidad },
                { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
            );
        }

        res.status(200).json({ mensaje: 'Elemento devuelto con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al devolver el elemento', error });
    }
};

const getLoans = async (req, res) => {
    const { documento } = req.params;
    try {
      const prestamos = await PrestamoCorriente.findOne({ where: { clientes_documento: documento } });
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
};

export { createLoan, findLoanElements, addOrUpdate, deleteLoan, returnItem, getLoans };