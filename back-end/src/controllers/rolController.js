import { Rol } from '../models/index.js';

// Obtener todos los roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un rol por id
const getRoleById = async (req, res) => {
    try {
        const role = await Rol.findByPk(req.params.idrol);
        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ message: 'El rol ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
    try {
        const role = await Rol.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un rol
const updateRole = async (req, res) => {
    try {
        const [updated] = await Rol.update(req.body, {
            where: { idrol: req.params.idrol }
        });
        if (updated) {
            const updatedRole = await Rol.findByPk(req.params.idrol);
            res.json(updatedRole);
        } else {
            res.status(404).json({ message: 'Rol no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un rol
const deleteRole = async (req, res) => {
    try {
        const deleted = await Rol.destroy({
            where: { idrol: req.params.idrol }
        });
        if (deleted) {
            res.status(200).json({ message: 'Rol eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'Rol no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllRoles, getRoleById, createRole, updateRole, deleteRole };