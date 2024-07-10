// controllers/userController.js
import Usuario from '../models/index.js';

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const user = await Usuario.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const [updated] = await Usuario.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await Usuario.findByPk(req.params.id);
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await Usuario.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
