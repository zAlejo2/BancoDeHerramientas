import { Baja, Cliente, Elemento, Area } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';
import upload from '../middlewares/archivoBajaMiddleware.js';

const obtenerHoraActual = () => ajustarHora(new Date());

// Registrar reintegro
const createReintegro = async (req, res) => {
    try {
        upload.single('archivo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.mensaje });
            }
            // Parsear elementos desde JSON
            const elementos = JSON.parse(req.body.elementos);

            const { area, id: adminId } = req.user;

            for (let elemento of elementos) {
                const { idelemento, cantidad, observaciones } = elemento; 

                if (cantidad <= 0) {
                    return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
                }

                const elementoEncontrado = await Elemento.findOne({ where: { idelemento , areas_idarea: area, tipo: 'devolutivo'}});
                if (!elementoEncontrado) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
                }

                if (cantidad > elementoEncontrado.cantidad) {
                    return res.status(400).json({ mensaje: `La cantidad de reintegro supera la cantidad total del elemento` });
                }

                const archivo = req.file ? req.file.filename : null;

                const reintegro = await Baja.create({
                    elementos_idelemento: idelemento,
                    tipo: 'reintegro',
                    cantidad,
                    observaciones,
                    areas_idarea: area,
                    fecha: obtenerHoraActual(),
                    idadmin: adminId,
                    archivo
                });

                await Elemento.update(
                    {
                        disponibles: elementoEncontrado.disponibles - cantidad,
                        cantidad: elementoEncontrado.cantidad - cantidad,
                        estado: elementoEncontrado.disponibles - cantidad <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                );

                createRecord(area, 'baja', reintegro.idbaja, adminId, 0, idelemento, elementoEncontrado.descripcion, cantidad, observaciones, 'reintegro', 'REINTEGRO');
            }
            return res.status(200).json({ mensaje: 'Elementos reintegrados con éxito' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error inesperado, intente recargar la página'});
    }
};
// RECORDAR PONER OBLIGARTORIO EL ARCHIVO Y EL DOCUMENTO EN EL TRASPASO
// Registrar traspaso
const createTraspaso = async (req, res) => {
    try {
        upload.single('archivo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.mensaje });
            }
            // Parsear elementos desde JSON
            const elementos = JSON.parse(req.body.elementos);
            const documento = req.body.documento;
            const { area, id: adminId } = req.user;

            const cuentadante = await Cliente.findOne({ where: {documento: documento}});
            if (!cuentadante) {
                return res.status(404).json({ mensaje: 'La persona a la que intenta hacer el traspaso no se encuentra registrada'});
            }

            for (let elemento of elementos) {
                const { idelemento, cantidad, observaciones } = elemento; 

                if (cantidad <= 0) {
                    return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
                }

                const elementoEncontrado = await Elemento.findOne({ where: { idelemento , areas_idarea: area, tipo: 'devolutivo'}});
                if (!elementoEncontrado) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
                }

                if (cantidad > elementoEncontrado.cantidad) {
                    return res.status(400).json({ mensaje: `La cantidad de traspaso supera la cantidad total del elemento` });
                }

                const archivo = req.file ? req.file.filename : null;

                const traspaso = await Baja.create({
                    elementos_idelemento: idelemento,
                    tipo: 'traspaso',
                    cantidad,
                    observaciones,
                    areas_idarea: area,
                    fecha: obtenerHoraActual(),
                    idadmin: adminId,
                    archivo,
                    clientes_documento: documento
                });

                await Elemento.update(
                    {
                        disponibles: elementoEncontrado.disponibles - cantidad,
                        cantidad: elementoEncontrado.cantidad - cantidad,
                        estado: elementoEncontrado.disponibles - cantidad <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                );

                createRecord(area, 'baja', traspaso.idbaja, adminId, 0, idelemento, elementoEncontrado.descripcion, cantidad, observaciones, 'traspaso', 'TRASPASO');
            }
            return res.status(200).json({ mensaje: 'Elementos traspasados con éxito' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error inesperado, intente recargar la página'});
    }
};

// Obtener todos los registros de las bajas 
const getAllReintegros = async (req, res) => {
    try {
        const { area } = req.user;
        const reintegros = await Baja.findAll({
            include: [
              {
                model: Elemento,
                where: { areas_idarea: area },  
                attributes: [ 'idelemento', 'descripcion', 'cantidad']
              }
            ],
            order: [['fecha', 'DESC']],
            where: { tipo: 'reintegro' }
        });
        const reintegroFormateado = reintegros.map(reintegro => {
            const fechaAccion = formatFecha(reintegro.fecha, 5);
            return {
              ...reintegro.dataValues,
              fecha: fechaAccion
            };
          });
      
          res.json(reintegroFormateado); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'Error al obtener los reintegros, por favor vuelva a intentarlo'})
    }
};

// Obtener todos los registros de traspasos
const getAllTraspasos = async (req, res) => {
    try {
        const { area } = req.user;
        const traspasos = await Baja.findAll({
            include: [
              {
                model: Elemento,
                where: { areas_idarea: area },  
                attributes: [ 'idelemento', 'descripcion', 'cantidad']
              }
            ],
            order: [['fecha', 'DESC']],
            where: { tipo: 'traspaso' }
        });
        const traspasoFormateado = traspasos.map(traspaso => {
            const fechaAccion = formatFecha(traspaso.fecha, 5);
            return {
              ...traspaso.dataValues,
              fecha: fechaAccion
            };
          });
      
          res.json(traspasoFormateado); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensaje: 'Error al obtener los traspasos, por favor vuelva a intentarlo'})
    }
};

// Devolver traspaso
const returnTraspaso = async (req, res) => {
    try {
        upload.single('archivo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.mensaje });
            }
            // Parsear elementos desde JSON
            const elementos = JSON.parse(req.body.elementos);
            const { area, id: adminId } = req.user;

            for (let elemento of elementos) {
                const { idelemento, cantidad, observaciones } = elemento; 

                if (cantidad <= 0) {
                    return res.status(400).json({ mensaje: `La cantidad no puede ser 0 ni menor que éste`});
                }

                const elementoEncontrado = await Elemento.findOne({ where: { idelemento , areas_idarea: area, tipo: 'devolutivo'}});
                if (!elementoEncontrado) {
                    return res.status(404).json({ mensaje: `Elemento con el ID ${idelemento} no encontrado en el inventario` });
                }

                if (cantidad > elementoEncontrado.cantidad) {
                    return res.status(400).json({ mensaje: `La cantidad de traspaso supera la cantidad total del elemento` });
                }

                const archivo = req.file ? req.file.filename : null;

                const traspaso = await Baja.create({
                    elementos_idelemento: idelemento,
                    tipo: 'traspaso',
                    cantidad,
                    observaciones,
                    areas_idarea: area,
                    fecha: obtenerHoraActual(),
                    idadmin: adminId,
                    archivo
                });

                await Elemento.update(
                    {
                        disponibles: elementoEncontrado.disponibles + cantidad,
                        cantidad: elementoEncontrado.cantidad + cantidad,
                        estado: elementoEncontrado.disponibles + cantidad <= elementoEncontrado.minimo ? 'agotado' : 'disponible'
                    },
                    { where: { idelemento } }
                );

                createRecord(area, 'baja', traspaso.idbaja, adminId, 0, idelemento, elementoEncontrado.descripcion, cantidad, observaciones, 'traspaso', 'REGRESO ELEMENTO');
            }
            return res.status(200).json({ mensaje: 'Elementos traspasados con éxito' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error inesperado, intente recargar la página'});
    }
};

export { createReintegro, getAllReintegros, createTraspaso, getAllTraspasos, returnTraspaso};