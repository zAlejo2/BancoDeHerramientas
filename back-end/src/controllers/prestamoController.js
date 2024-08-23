import { PrestamoCorriente, ElementoHasPrestamoCorriente, Cliente, Elemento } from '../models/index.js';
import { Op } from 'sequelize';

// Buscar cliente por documento
// const getClientByDocument = async (req, res) => {
//     try {
//         const { documento } = req.params;
//         const cliente = await Cliente.findOne({ where: { documento } });

//         if (!cliente) {
//             return res.status(404).json({ mensaje: 'Cliente no encontrado' });
//         }

//         res.json(cliente);
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al buscar el cliente', error });
//     }
// };

// // Buscar elementos por nombre o ID
// const getElement = async (req, res) => {
//     try {
//         const { query } = req.params;

//         const elementos = await Elemento.findAll({
//             where: {
//                 [Op.or]: [
//                     { descripcion: { [Op.like]: `%${query}%` } },
//                     { idelemento: query }
//                 ]
//             }
//         });

//         if (elementos.length === 0) {
//             return res.status(404).json({ mensaje: 'No se encontraron elementos' });
//         }

//         res.json(elementos);
//     } catch (error) {
//         res.status(500).json({ mensaje: 'Error al buscar los elementos', error });
//     }
// };

const lendOut = async (req, res) => {
    try {
        const { documento, elementos } = req.body;

        const cliente = await Cliente.findOne({ where: { documento } });
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const loanExisting = await PrestamoCorriente.findOne({ where: { clientes_documento: documento } });
        if (loanExisting) {
            return res.status(400).json({ mensaje: 'El Cliente ingresado ya tiene un préstamo en curso' });
        }

        const prestamo = await PrestamoCorriente.create({
            clientes_documento: cliente.documento
        });

        for (let elemento of elementos) {
            const { idelemento, cantidad } = elemento;

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento } });
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con ID ${idelemento} no encontrado` });
            }

            if (elementoEncontrado.disponibles < cantidad) {
                return res.status(400).json({ mensaje: `El elemento con ID ${idelemento} no tiene suficiente cantidad disponible` });
            }

            await ElementoHasPrestamoCorriente.create({
                elementos_idelemento: idelemento,
                prestamoscorrientes_idprestamo: prestamo.idprestamo,
                cantidad,
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

        res.status(201).json({ mensaje: 'Préstamo realizado con éxito', prestamo });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al realizar el préstamo', error });
    }
};

const updateLoan = async (req, res) => {
    try {
        const { idprestamo, elementos } = req.body;

        const prestamo = await PrestamoCorriente.findOne({ where: { idprestamo } });
        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }

        for (let elemento of elementos) {
            const { idelemento, cantidad } = elemento;

            const elementoEnPrestamo = await ElementoHasPrestamoCorriente.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo
                }
            });

            if (elementoEnPrestamo) {
                if (cantidad === 0) {
                    await ElementoHasPrestamoCorriente.destroy({
                        where: {
                            elementos_idelemento: idelemento,
                            prestamoscorrientes_idprestamo: idprestamo
                        }
                    });

                    const elementoEncontrado = await Elemento.findOne({ where: { idelemento } });
                    await Elemento.update(
                        {
                            disponibles: elementoEncontrado.disponibles + elementoEnPrestamo.cantidad,
                            estado: elementoEncontrado.disponibles + elementoEnPrestamo.cantidad > elementoEncontrado.minimo ? 'disponible' : 'agotado'
                        },
                        { where: { idelemento } }
                    );
                } else {
                    const diferenciaCantidad = cantidad - elementoEnPrestamo.cantidad;

                    const elementoEncontrado = await Elemento.findOne({ where: { idelemento } });
                    if (elementoEncontrado.disponibles < diferenciaCantidad) {
                        return res.status(400).json({ mensaje: `El elemento con ID ${idelemento} no tiene suficiente cantidad disponible` });
                    }

                    await ElementoHasPrestamoCorriente.update(
                        { cantidad },
                        { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                    );

                    await Elemento.update(
                        {
                            disponibles: elementoEncontrado.disponibles - diferenciaCantidad,
                            estado: elementoEncontrado.disponibles - diferenciaCantidad > elementoEncontrado.minimo ? 'disponible' : 'agotado'
                        },
                        { where: { idelemento } }
                    );
                }
            } else {
                if (cantidad > 0) {
                    const elementoEncontrado = await Elemento.findOne({ where: { idelemento } });
                    if (!elementoEncontrado || elementoEncontrado.disponibles < cantidad) {
                        return res.status(400).json({ mensaje: `El elemento con ID ${idelemento} no tiene suficiente cantidad disponible` });
                    }

                    await ElementoHasPrestamoCorriente.create({
                        elementos_idelemento: idelemento,
                        prestamoscorrientes_idprestamo: idprestamo,
                        cantidad,
                        estado: 'actual'
                    });

                    await Elemento.update(
                        {
                            disponibles: elementoEncontrado.disponibles - cantidad,
                            estado: elementoEncontrado.disponibles - cantidad > elementoEncontrado.minimo ? 'disponible' : 'agotado'
                        },
                        { where: { idelemento } }
                    );
                }
            }
        }

        const elementosRestantes = await ElementoHasPrestamoCorriente.findAll({
            where: { prestamoscorrientes_idprestamo: idprestamo }
        });

        if (elementosRestantes.length === 0) {
            await PrestamoCorriente.destroy({ where: { idprestamo } });
        }

        res.status(200).json({ mensaje: 'Préstamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el préstamo', error });
    }
};

export { lendOut, updateLoan };