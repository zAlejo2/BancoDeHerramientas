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
            const loanElements = await ElementoHasPrestamoCorriente.findAll({ where: { prestamoscorrientes_idprestamo: idprestamo, estado: 'actual' }});

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
                
                if (elementoExistente.estado == 'actual') {
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
                            elementos_idelemento: elementoExistente.elementos_idelemento,
                        }
                    });
                }
            }
        }

        for (let elemento of elementos) {
            const { idelemento, cantidad, cantidadd, observaciones, estado } = elemento;

            const elementoEncontrado = await Elemento.findOne({ where: { idelemento }});
            if (!elementoEncontrado) {
                return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
            }
            const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

            if (cantidad <= 0) {
                return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
            } else if (cantidadd < 0 || cantidadd > cantidad) {
                return res.status(400).json({ mensaje: `La cantidad de devolución no puede ser menor que 0 ni mayor que la cantidad prestada`})
            }

            const elementoEnPrestamo = await ElementoHasPrestamoCorriente.findOne({
                where: {
                    elementos_idelemento: idelemento,
                    prestamoscorrientes_idprestamo: idprestamo
                }
            });
            
            if (elementoEnPrestamo) {
                const cantidadNueva = cantidad - cantidadd;
                const diferencia = elementoEnPrestamo.cantidad - cantidadNueva; 
                const dispoTotalUpdate = dispoTotal + elementoEnPrestamo.cantidad;
                if((dispoTotalUpdate < cantidad) && (cantidad > elementoEnPrestamo.cantidad)) {
                    return res.status(400).json({ mensaje: `La cantidad solicitada del elemento con el id ${idelemento} supera la cantidad disponible de éste`}) 
                } 
                const elementoReq = req.body.elementos.find(e => e.idelemento === elementoEnPrestamo.dataValues.elementos_idelemento);
                const isSameCantidad = Number(elementoReq.cantidad) === Number(elementoEnPrestamo.dataValues.cantidad);
                
                if (isSameCantidad) {
                    if (estado == 'finalizado') {
                        if (elementoEnPrestamo.estado == 'actual') {
                            await ElementoHasPrestamoCorriente.update(
                                { estado: 'finalizado', observaciones: observaciones, fecha_devolucion: obtenerHoraActual() },
                                { where: { elementos_idelemento: idelemento, prestamoscorrientes_idprestamo: idprestamo } }
                            );
                            await Elemento.update(
                                { 
                                    disponibles: elementoEncontrado.disponibles + cantidad,
                                    estado: elementoEncontrado.disponibles + cantidad <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                                },
                                { where: { idelemento } }
                            );
                        }
                    } else {
                        await ElementoHasPrestamoCorriente.update(
                            { cantidad: cantidadNueva, observaciones: observaciones },
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
                    if (estado == 'finalizado'){
                        return res.status(400).json({ mensaje: 'Actualizaste la cantidad, guarda cambios' });
                    }
                    await ElementoHasPrestamoCorriente.update(
                        { cantidad: cantidadNueva, observaciones: observaciones },
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
        
        const elementosDelPrestamo = await ElementoHasPrestamoCorriente.findAll({ where: { prestamoscorrientes_idprestamo: idprestamo }});
        const estadosDeElementos = elementosDelPrestamo.map((elemento) => elemento.estado);
        if(!estadosDeElementos.includes('actual')) {
            await PrestamoCorriente.update(
                { estado: 'finalizado'},
                { where: {idprestamo}}
            )
            console.log('estado de prestamo finalizado')
        }

        return res.status(200).json({ mensaje: 'Elementos agregados al prestamo y actualizados con éxito' })

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

const getLoans = async (req, res) => {
    const { documento } = req.params;
    try {
      const prestamos = await PrestamoCorriente.findOne({ where: { clientes_documento: documento } });
      res.json(prestamos);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching data' });
    }
};

const getAllLoanElements = async (req, res) => {
    try {
      const prestamosTodos = await ElementoHasPrestamoCorriente.findAll({
        include: [
          {
            model: PrestamoCorriente,
            include: [
              {
                model: Cliente,  
                attributes: ['documento', 'roles_idrol', 'nombre']
              }
            ],
            attributes: ['idprestamo', 'clientes_documento']  
          },
          {
            model: Elemento,  
            attributes: ['idelemento', 'descripcion']
          }
        ]
      });

      const prestamosFormateados = prestamosTodos.map(prestamo => {
        const fechaEntrega = formatFecha(prestamo.fecha_entrega, 5);
        return {
          ...prestamo.dataValues,
          fecha_entrega: fechaEntrega
        };
      });
  
      return res.status(200).json(prestamosFormateados); 
    } catch (error) {
      console.error('Error al obtener los préstamos:', error);
      return res.status(500).json({ error: 'Error al obtener los préstamos' });
    }
};    

export { createLoan, findLoanElements, addOrUpdate, deleteLoan, getLoans, getAllLoanElements };