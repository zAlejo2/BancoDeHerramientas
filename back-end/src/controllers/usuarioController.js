import { Usuario } from '../models/index.js';

// Obtener todos los Usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Usuario por documento
const getUserById = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.documento);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'El Usuario ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo Usuario
const createUser = async (req, res) => {
    try {
        const user = await Usuario.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

// Actualizar un Usuario
const updateUser = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.documento);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isSameData = Object.keys(req.body).every(key => user[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ message: 'No se ha hecho ningún cambio en el Usuario' });
        }

        const [updated] = await Usuario.update(req.body, {
            where: { documento: req.params.documento }
        });

        if (updated) {
            const updateduser = await Usuario.findByPk(req.params.documento);
            res.json(updateduser);
        } else {
            res.status(404).json({ message: 'Error al actualizar el Usuario' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Eliminar un Usuario
const deleteUser = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({
            where: { documento: req.params.documento }
        });
        if (deleted) {
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };