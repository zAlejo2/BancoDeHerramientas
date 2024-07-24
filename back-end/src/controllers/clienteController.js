import { Cliente } from '../models/index.js';

// Obtener todos los Clientes
const getAllClients = async (req, res) => {
    try {
        const users = await Cliente.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Cliente por documento
const getClientById = async (req, res) => {
    try {
        const user = await Cliente.findByPk(req.params.documento);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'El Cliente ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo Cliente
const createClient = async (req, res) => {
    try {
        const userExisting = await Cliente.findByPk(req.body.documento);

        if(!userExisting) { 
            const user = await Cliente.create(req.body);
            res.status(201).json(user);
        } else {
            res.status(400).json({ message: 'El Cliente ingresado ya existe' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

// Actualizar un Cliente
const updateClient = async (req, res) => {
    try {
        const user = await Cliente.findByPk(req.params.documento);

        if (!user) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const isSameData = Object.keys(req.body).every(key => user[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ message: 'No se ha hecho ningún cambio en el Cliente' });
        }

        const [updated] = await Cliente.update(req.body, {
            where: { documento: req.params.documento }
        });

        if (updated) {
            const updatedUser = await Cliente.findByPk(req.params.documento);
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Error al actualizar el Cliente' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un Cliente
const deleteClient = async (req, res) => {
    try {
        const deleted = await Cliente.destroy({
            where: { documento: req.params.documento }
        });
        if (deleted) {
            res.status(200).json({ message: 'Cliente eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllClients, getClientById, createClient, updateClient, deleteClient };