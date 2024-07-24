import { Area } from '../models/index.js';

// Obtener todas las areas
const getAllAreas = async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un area por id
const getAreaById = async (req, res) => {
    try {
        const area = await Area.findByPk(req.params.idarea);
        if (area) {
            res.json(area);
        } else {
            res.status(404).json({ message: 'El area ingresada no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva area
const createArea = async (req, res) => {
    try {
        const areaExisting = await Area.findByPk(req.body.idarea);

        if(!areaExisting) { 
            const area = await Area.create(req.body);
            res.status(201).json(area);
        } else {
            res.status(400).json({ message: 'El Area ingresada ya existe' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { getAllAreas, getAreaById, createArea };