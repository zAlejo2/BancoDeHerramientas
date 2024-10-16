import { Administrador } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Obtener todos los Administradores
const getAllAdmins = async (req, res) => {
    try {
        const { area } = req.user;
        const admins = await Administrador.findAll({where: {areas_idarea: area}});
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Administrador por documento
const getAdminById = async (req, res) => {
    try {
        const admin = await Administrador.findByPk(req.params.documento);
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ mensaje: 'El Administrador ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo Administrador
const createAdmin = async (req, res) => {
    try {
        const { area } = req.user;
        const adminExisting = await Administrador.findByPk(req.body.documento);

        if(!adminExisting) { 
            if (req.body.contrasena !== '') {
                req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
            }

            const registro = await Administrador.create({...req.body, areas_idarea: area});
                
            res.status(201).json(registro);
        } else {
            res.status(400).json({ mensaje: 'El Administrador que intenta crear ya existe' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

// Actualizar un Administrador
const updateAdmin = async (req, res) => {
    try {
        const { area } = req.user;
        const admin = await Administrador.findByPk(req.params.documento);

        if (!admin) {
            return res.status(404).json({ mensaje: 'Administrador no encontrado' });
        }

        const isSameData = Object.keys(req.body).every(key => admin[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ mensaje: 'No se ha hecho ningún cambio en el Administrador' });
        }

        const [updated] = await Administrador.update(req.body, {
            where: { documento: req.params.documento, areas_idarea: area }
        });

        if (updated) {
            const updatedUser = await Administrador.findByPk(req.params.documento);
            res.json(updatedUser);
        } else {
            res.status(404).json({ mensaje: 'Error al actualizar el Administrador, por favor vuelva a intentarlo' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un Administrador
const deleteAdmin = async (req, res) => {
    try {
        const { area } = req.user;
        const deleted = await Administrador.destroy({
            where: { documento: req.params.documento, areas_idarea: area }
        });
        if (deleted) {
            res.status(200).json({ mensaje: 'Administrador eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ mensaje: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };