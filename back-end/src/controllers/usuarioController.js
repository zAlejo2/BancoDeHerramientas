import { Usuario } from '../models/index.js';

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por documento
const getUserById = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.documento);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'El usuario ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const user = await Usuario.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const [updated] = await Usuario.update(req.body, {
            where: { documento: req.params.documento }
        });
        if (updated) {
            const updatedUser = await Usuario.findByPk(req.params.documento);
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({
            where: { documento: req.params.documento }
        });
        if (deleted) {
            res.status(200).json({ message: 'usuario eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
