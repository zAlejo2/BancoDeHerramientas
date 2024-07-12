import { Elemento } from '../models/index.js';

// Obtener todos los roles
const getAllElements = async (req, res) => {
    try {
        const elements = await Elemento.findAll();
        res.json(elements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un rol por id
const getElementById = async (req, res) => {
    try {
        const element = await Elemento.findByPk(req.params.idelemento);
        if (element) {
            res.json(element);
        } else {
            res.status(404).json({ message: 'El elemento ingresado no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo rol
const createElement = async (req, res) => {
    try {
        const element = await Elemento.create(req.body);
        res.status(201).json(element);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un rol
const updateElement = async (req, res) => {
    try {
        const [updated] = await Elemento.update(req.body, {
            where: { idelemento: req.params.idelemento }
        });
        if (updated) {
            const updatedElement = await Elemento.findByPk(req.params.idelemento);
            res.json(updatedElement);
        } else {
            res.status(404).json({ message: 'Elemento no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un rol
const deleteElement = async (req, res) => {
    try {
        const deleted = await Elemento.destroy({
            where: { idelemento: req.params.idelemento }
        });
        if (deleted) {
            res.status(200).json({ message: 'Elemento eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ message: 'Elemento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllElements, getElementById, createElement, updateElement, deleteElement };