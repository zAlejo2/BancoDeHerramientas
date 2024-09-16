import { Mora } from '../models/index.js';
import { ajustarHora, formatFecha } from './auth/adminsesionController.js';
import { createRecord } from './historialController.js';

const obtenerHoraActual = () => ajustarHora(new Date());

const createMora = async (req, res) => {
    try {
        const {idelemento, cantidad, observaciones, documento} = req.body;
        const mora = await Mora.create({
            cantidad: cantidad,
            fecha: obtenerHoraActual(),
            observaciones: observaciones,
            elementos_idelemento: idelemento,
            clientes_documento: documento
        })
        return res.json(mora)
    } catch(error) {
        console.log(error)
        return res.status(500).json({mensaje: error})
    }
}

export { createMora };