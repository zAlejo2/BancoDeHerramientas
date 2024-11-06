import { PrestamoEspecial, ElementoHasPrestamoEspecial, Cliente, Elemento, Mora, Dano } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';
import { createMora } from './moraController.js';
import { createDano } from './danoController.js';
import { recordConsumption } from './consumoController.js';
import upload from '../middlewares/archivoPrestamoEspecialMiddleware.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createLoan = async (req, res) => {
    try {
        const { area, id: adminId } = req.user;
        const { documento, continuar } = req.body;

        const cliente = await Cliente.findOne({ where: { documento }});
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        } 

        const mora = await Mora.findOne({ where: { clientes_documento: cliente.documento, areas_idarea: area } });

        // Si el cliente está en mora y el frontend no ha enviado "continuar", muestra advertencia
        if (mora && !continuar) {
            return res.status(200).json({ advertencia: 'El cliente está en MORA', continuar: true });
        }
        // Si el cliente está en mora pero el frontend ha enviado "continuar", sigue el proceso

        const dano = await Dano.findOne({ where: { clientes_documento: cliente.documento, areas_idarea: area } });
        if (dano && !continuar) {
            return res.status(200).json({ advertencia: 'El cliente tiene un DAÑO', continuar: true });
        }

        const loanExisting = await PrestamoCorriente.findOne({
            where: { clientes_documento: documento, estado: 'actual', areas_idarea: area }
        });

        if (loanExisting) {
            let idprestamo = loanExisting.idprestamo;
            return res.status(200).json({ idprestamo });
        }
        const clientes_documento = loanExisting.clientes_documento; console.log(loanExisting.clientes_documento, clientes_documento);
        return res.status(200).json({ clientes_documento, elementos: [] });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear préstamo: ', error });
    }
};

// PARA TRAER LOS ELEMENTOS QUE YA ESTABAN EN EL PRESTAMO
const findLoanElements = async (req, res) => {
    const { idprestamo } = req.params;
    const { area } = req.user;

    try {
        const loanExisting = await PrestamoCorriente.findOne({ where: { idprestamo: idprestamo, estado: 'actual', areas_idarea: area} });
        const cliente = await Cliente.findOne({ where: {documento:loanExisting.clientes_documento}});
        const nombre = cliente.nombre;
        const documento = cliente.documento;
        const grupo = cliente.roles_idrol;
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

            return res.status(200).json({ idprestamo, elementos, documento, nombre, grupo });
        } else {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener elementos del préstamo:', error);
        return res.status(500).json({ mensaje: 'Error al obtener los elementos del préstamo, por favor vuelva a intentarlo' });
    }
};

// CREAR PRESTAMO ESPECIAL
const createPrestamoEspecial = async (req, res) => {
    try {
        upload.single('archivo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ mensaje: 'Error desconocido con el archivo' });
            }
            // Parsear elementos desde JSON(Variables de solicitud)
            const elementos = JSON.parse(req.body.elementos);
            const { area, id: adminId } = req.user;
            const { clientes_documento, fecha_inicio, fecha_fin } = req.body;
            const archivo = req.file ? req.file.filename : null;

            //Verificación de Cliente y Archivo
            const clienteExists = await Cliente.findOne({where: {documento: clientes_documento}});
            if (!clienteExists || clientes_documento == '') {
                return res.status(400).json({ mensaje: 'La persona no se encuentra registrada'})
            }

            if (!archivo) {
                return res.status(400).json({mensaje: 'El archivo es obligatorio'});
            }
            
            //Creación del Préstamo Especial
            const prestamoEspecial = await PrestamoEspecial.create({
                clientes_documento: clientes_documento,
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin,
                archivo: archivo,
                areas_idarea: area
            });

            const idprestamo = prestamoEspecial.idprestamo;
            
            for (let elemento of elementos) {
                const { idelemento, cantidad, observaciones } = elemento;

                const elementoEncontrado = await Elemento.findOne({ where: { idelemento, areas_idarea: area }});
                if (!elementoEncontrado) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
                }
                const dispoTotal = elementoEncontrado.disponibles - elementoEncontrado.minimo;

                if (cantidad <= 0) {
                    return res.status(400).json({ mensaje: `La cantidad de préstamo no puede ser 0 ni menor que éste`});
                }
            
                const elementoDisponible = await Elemento.findOne({ where: { idelemento, estado: 'disponible', areas_idarea:area }});
                if (!elementoDisponible) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} agotado` });
                }

                if (dispoTotal < cantidad) {
                    return res.status(400).json({ mensaje: `La cantidad solicitada del elemento con el ID ${idelemento} supera la disponibilidad de éste, revise mínimos en el inventario` });
                }

                await ElementoHasPrestamoEspecial.create({
                    elementos_idelemento: idelemento,
                    prestamosespeciales_idprestamo: prestamoEspecial.idprestamo,
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
                createRecord(area,'prestamo', idprestamo, adminId, prestamoEspecial.clientes_documento, idelemento, elementoEncontrado.descripcion, cantidad, observaciones, 'actual', 'PRESTAMO ESPECIAL ELEMENTO'); 
            }
            
            //Este Actualiza el estado del Prestamo

            const elementosDelPrestamo = await ElementoHasPrestamoEspecial.findAll({ where: { prestamosespeciales_idprestamo: prestamoEspecial.idprestamo }});
            const estadosDeElementos = elementosDelPrestamo.map((elemento) => elemento.estado);
            if(!estadosDeElementos.includes('actual')) {
                await PrestamoEspecial.update(
                    { estado: 'finalizado'},
                    { where: {idprestamo}}
                );
                await PrestamoEspecial.destroy({
                    where: {
                        idprestamo: prestamoEspecial.idprestamo,
                        clientes_documento: prestamoEspecial.clientes_documento,
                        estado: 'finalizado'
                    }
                });
                // createRecord(area,'prestamo', idprestamo, adminId, prestamo.clientes_documento, null, null, null, 'finalizado', 'FINALIZAR PRESTAMO'); 
            }

            return res.status(200).json({ mensaje: 'Prestamo Especial creado con éxito' })
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error al crear el préstamo especial, por favor vuelva a intentarlo'});
    }
};

// PARA OBTENER LOS PRESTAMOS ACTIVOS
const getAllLoanElements = async (req, res) => {
    try {
        const { area, id: adminId } = req.user;
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
            where: { areas_idarea: area },  
            attributes: ['idelemento', 'descripcion']
          }
        ]
      });

      const prestamosFormateados = prestamosTodos.map(prestamo => {
        const fechaEntrega = formatFecha(prestamo.fecha_entrega, 5);
        const fechaDevolucion = formatFecha(prestamo.fecha_devolucion, 5);
        return {
          ...prestamo.dataValues,
          fecha_entrega: fechaEntrega,
          fecha_devolucion: fechaDevolucion,
        };
      });
  
      return res.status(200).json(prestamosFormateados); 
    } catch (error) {
      console.error('Error al obtener los préstamos:', error);
      return res.status(500).json({ error: 'Error al obtener los préstamos' });
    }
};    

export { createLoan, findLoanElements, createPrestamoEspecial, getAllLoanElements };