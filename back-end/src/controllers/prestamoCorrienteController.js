import { PrestamoCorriente, ElementoHasPrestamoCorriente, Cliente, Elemento, Historial } from '../models/index.js';
import { ajustarHora, formatFecha, admin_id } from './auth/adminsesionController.js';

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

    try {
        const loanExisting = await PrestamoCorriente.findOne({ where: { idprestamo: idprestamo, estado: 'actual' } });
        if (loanExisting) {
            let idprestamo = loanExisting.idprestamo;
            const loanElements = await ElementoHasPrestamoCorriente.findAll({ where: { prestamoscorrientes_idprestamo: idprestamo }});

            const elementosEnPrestamo = loanElements.map(async loanElement => {
                const { elementos_idelemento, cantidad, observaciones, fecha_entrega, fecha_devolucion, estado } = loanElement;

                const fecha_entregaFormato = formatFecha(fecha_entrega, 5);
                const fecha_devolucionFormato = formatFecha(fecha_devolucion, 5);

                const elemento = await Elemento.findOne({ where: { idelemento: elementos_idelemento }});
                return { elemento, cantidad, observaciones, fecha_entregaFormato, fecha_devolucionFormato, estado };
            });

            const elementos = await Promise.all(elementosEnPrestamo);

            return res.status(200).json({ idprestamo, elementos });
        } else {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener elementos del préstamo:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los elementos del préstamo' });
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

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
            }

            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            }

            const elementoEnPrestamo = await ElementoHasPrestamoCorriente.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo
                }
            });

            if(elementoEnPrestamo) {
                const dispoTotalUpdate = dispoTotal + elementoEnPrestamo.cantidad;
                if((dispoTotalUpdate < cantidad) && (cantidad > elementoEnPrestamo.cantidad)) {
                    return res.status(400).json({ mensaje: `La cantidad solicitada del elemento con el id ${idelemento} supera la cantidad disponible de éste`}) 
                } 

                const diferencia = elementoEnPrestamo.cantidad - cantidad;

                const elementoReq = req.body.elementos.find(e => e.idelemento === elementoEnPrestamo.dataValues.elementos_idelemento);

                if (elementoReq) {
                    const isSameCantidad = Number(elementoReq.cantidad) === Number(elementoEnPrestamo.dataValues.cantidad);
                    const isSameObservacion = elementoReq.observaciones === elementoEnPrestamo.dataValues.observaciones;
                    
                    if (!isSameCantidad || !isSameObservacion) {
                        console.log('La cantidad ha cambiado.');
                        await ElementoHasPrestamoCorriente.update(
                            { cantidad: cantidad, observaciones: observaciones, fecha_entrega: obtenerHoraActual() },
                            { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                        );
        
                        await Elemento.update(
                            {
                                disponibles: elementoEncontrado.disponibles + diferencia,
                                estado: elementoEncontrado.disponibles + diferencia <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                            },
                            { where: { idelemento } }
                        ); 
        
                    } 
                } else {
                    console.log('No se encontró el elemento para editar');
                }

            } else {
                const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible' }});
                if (!elementoDisponible) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} agotado` });
                }

                if (dispoTotal < cantidad) {
                    return res.status(400).json({ mensaje: `No hay suficientes elementos del ID ${idelemento} para hacer el préstamo, revise mínimos en el inventario` });
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

const returnItem = async (idprestamo, idelemento, cantidad) => {
    try {
        const elemento = await Elemento.findOne({
            where: { idelemento }
        })

        const elementoPrestamo = await ElementoHasPrestamoCorriente.findOne({
            where: {
                elementos_idelemento: idelemento,
                prestamoscorrientes_idprestamo: idprestamo
            }
        });

        if (elementoPrestamo) {
            if (cantidad === elementoPrestamo.cantidad) {
                await ElementoHasPrestamoCorriente.update(
                    { estado: 'finalizado', fecha_devolucion: obtenerHoraActual() },
                    { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                );
                await Elemento.update(
                    { 
                        disponibles: elemento.disponibles + cantidad,
                        estado: elemento.disponibles + cantidad <= elemento.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                );
                console.log('Elemento devuelto con éxito')
            } else {
                console.log('Primero debes guardar los cambios del préstamo antes de hacer la devolución')
            }
        } else {
            console.log('No puedes devolver el elemento si aún no lo has prestado');
        }
    } catch (error) {
        console.log(error)
        console.log( 'Error al devolver el elemento', error );
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

export { createLoan, findLoanElements, addOrUpdate, deleteLoan, getLoans };