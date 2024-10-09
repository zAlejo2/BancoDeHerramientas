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

        const { nombre } = req.body;
        const areaMax = await Area.findOne({
            order: [['idarea', 'DESC']],
            attributes: ['idarea'],
        });
        const idarea = areaMax ? areaMax.idarea + 1 : 1;

        const area = await Area.create({
            idarea: idarea,
            nombre: nombre
        });
        res.status(200).json(area);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error inesperado, intente recargar la página' });
    }
};

// Actualizar un area
const updateArea = async (req, res) => {
    try {
        const area = await Area.findByPk(req.params.idarea);

        if (!area) {
            return res.status(404).json({ mensaje: 'Area no encontrada' });
        }

        const isSameData = Object.keys(req.body).every(key => area[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ mensaje: 'No se ha hecho ningún cambio en el Area' });
        }

        const [updated] = await Area.update(req.body, {
            where: { idarea: req.params.idarea }
        });

        if (updated) {
            const updatedArea = await Area.findByPk(req.params.idarea);
            res.json(updatedArea);
        } else {
            res.status(404).json({ mensaje: 'Error al actualizar el Area' });
        }
    } catch (error) {
        res.status(400).json({ mensaje: 'Error inesperado, recargue la página' });
    }
};

// Eliminar un area
const deleteArea = async (req, res) => {
    try {
        const deleted = await Area.destroy({
            where: { idarea: req.params.idarea }
        });
        if (deleted) {
            res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
            // el 204 indica que el servidor ha recibido la solicitud con éxito, pero no devuelve ningún contenido.
        } else {
            res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllAreas, getAreaById, createArea, updateArea, deleteArea };