import { Baja, Cliente, Elemento, Area } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';
import upload from '../middlewares/archivoBajaMiddleware.js';

const obtenerHoraActual = () => ajustarHora(new Date());

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
                createRecord(area, 'baja', reintegro.idbaja, adminId, 0, idelemento, cantidad, observaciones, 'baja', 'REINTEGRO');
            }
            return res.status(200).json({ mensaje: 'Elementos reintegrados con éxito' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Error inesperado, intente recargar la página'});
    }
};

export { createReintegro };