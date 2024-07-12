import { Administrador } from '../models/index.js';

// Obtener todos los administradores
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Administrador.findAll();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un administrador por documento
const getAdminById = async (req, res) => {
    try {
        const admin = await Administrador.findByPk(req.params.documento);
        if (admin) {
            res.json(admin);
        } else {
            res.status(404).json({ message: 'El administrador ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo administrador
const createAdmin = async (req, res) => {
    try {
        const admin = await Administrador.create(req.body);
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

// Actualizar un administrador
const updateAdmin = async (req, res) => {
    try {
        const admin = await Administrador.findByPk(req.params.documento);
        
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        const isSameData = Object.keys(req.body).every(key => admin[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ message: 'No se ha hecho ningún cambio en el administrador' });
        }

        const [updated] = await Administrador.update(req.body, {
            where: { documento: req.params.documento }
        });

        if (updated) {
            const updatedAdmin = await Administrador.findByPk(req.params.documento);
            res.json(updatedAdmin);
        } else {
            res.status(404).json({ message: 'Error al actualizar el administrador' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Eliminar un administrador
const deleteAdmin = async (req, res) => {
    try {
        const deleted = await Administrador.destroy({
            where: { documento: req.params.documento }
        });
        if (deleted) {
            res.status(200).json({ message: 'administrador eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };