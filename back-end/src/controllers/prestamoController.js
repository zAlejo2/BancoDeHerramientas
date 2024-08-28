import { PrestamoCorriente, ElementoHasPrestamoCorriente, Cliente, Elemento } from '../models/index.js';
import { ajustarHora } from './auth/adminsesionController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const lendOut = async (req, res) => {
    try {
        const { documento, elementos } = req.body; 

        const cliente = await Cliente.findOne({ where: { documento } });
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const loanExisting = await PrestamoCorriente.findOne({ where: { clientes_documento: documento, estado: 'actual' } });
        if (loanExisting) {
            return res.status(400).json({ mensaje: 'El Cliente ingresado ya tiene un préstamo en curso' });
        }

        const prestamo = await PrestamoCorriente.create({
            clientes_documento: cliente.documento,
            estado: 'actual'
        });

        for (let elemento of elementos) {
            const { idelemento, cantidad, observaciones } = elemento;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor a éste`});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento, estado: 'disponible' } });
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con ID ${idelemento} no encontrado o agotado, revisa inventario` });
            }

            if (elementoEncontrado.disponibles < cantidad) {
                return res.status(400).json({ mensaje: `No hay suficiente cantidad del elemento con ID ${idelemento} disponible para prestar` });
            }

            await ElementoHasPrestamoCorriente.create({
                elementos_idelemento: idelemento,
                prestamoscorrientes_idprestamo: prestamo.idprestamo,
                fecha_entrega: obtenerHoraActual(),
                cantidad,
                observaciones,
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

const updateLoan = async (req, res) => {
    try {
        const { idprestamo, elementos } = req.body;

        const prestamo = await PrestamoCorriente.findByPk(idprestamo);
        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }

        for (let elemento of elementos) {

            const { idelemento, cantidad, observaciones } = elemento;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            }

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con ID ${idelemento} no encontrado` });
            }

            if (elementoEncontrado.disponibles < cantidad) {
                return res.status(400).json({ mensaje: `No hay suficiente cantidad del elemento con ID ${idelemento} disponible para prestar` });
            }

            const elementoPrestamo = await ElementoHasPrestamoCorriente.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo
                }
            });

            const diferencia = elementoPrestamo.cantidad - cantidad;

             //cuando el elemento que se ingresa es nuevo
            //gener aproblema porque no puede leer lantidad de elementoPrestamo porque no existe, resolver
            //falta también que no deje repetir el elemento en la lista
            // tengo que cuadrar el condicional de arriba porque como están dentro no me toma las constantes
            // y abajo no encuentra la variable de diferencia en Elemento.update

            if (elementoPrestamo) {

                await ElementoHasPrestamoCorriente.update(
                    { cantidad: cantidad, observaciones: observaciones},
                    { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                );


            } else {
                await ElementoHasPrestamoCorriente.create({
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo,
                    fecha_entrega: obtenerHoraActual(),
                    cantidad,
                    observaciones,
                    estado: 'actual'
                });
            }
            await Elemento.update(
                {
                    disponibles: elementoEncontrado.disponibles + diferencia,
                    estado: elementoEncontrado.disponibles + diferencia <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                },
                { where: { idelemento } }
            );
        }

        res.status(200).json({ mensaje: 'Préstamo actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el préstamo', error });
        console.log(error);
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

export { lendOut, returnItem, updateLoan, getLoans };