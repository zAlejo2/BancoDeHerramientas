import { Elemento, Area } from '../models/index.js';
import { Sequelize } from 'sequelize';
import upload from '../middlewares/fotoElementoMiddleware.js';

// Obtener todos los elementos
const getAllElements = async (req, res) => {
    try {
        const area = req.area;
        const elements = await Elemento.findAll({where: { areas_idarea: area}});
        res.json(elements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un elemento por id
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

// Obtener un elemento por su nombre
const getElementByName = async (req, res) => {
    try {
        const searchParam = req.params.descripcion.toLowerCase();
        const area = req.area;

        // Verifica si el parámetro es un número (posible id)
        const isId = !isNaN(searchParam);

        const elements = await Elemento.findAll({
            where: {
                areas_idarea: area,
                [Sequelize.Op.or]: [
                    // Si el parámetro es un id, busca por idelemento
                    isId ? { idelemento: searchParam } : null,
                    // Siempre busca por la descripción
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('descripcion')),
                        'LIKE',
                        `%${searchParam}%`
                    )
                ].filter(Boolean)
            }
        });

        if (elements.length > 0) {
            res.json(elements);
        } else {
            res.status(404).json({ message: 'El elemento buscado no se encuentra' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Crear un nuevo elemento
const createElement = async (req, res) => {
    try {
        // Manejar la carga de archivos
        upload.single('foto')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            const elementExisting = await Elemento.findByPk(req.body.idelemento);
            if (elementExisting) {
                return res.status(400).json({ message: 'El Elemento ingresado ya existe' });
            }

            const areaMissing = await req.body.areas_idarea;

            if( areaMissing == '') {
                return res.status(400).json({ message: 'El area del elemento no puede estar vacía'});
            }

            const areaExist = await Area.findByPk(req.body.areas_idarea);

            if(!areaExist) {
                return res.status(400).json({ message: 'El area ingresada no existe' });
            }

            // Obtener el nombre del archivo de la imagen subida
            const foto = req.file ? req.file.filename : null;

            const element = await Elemento.create({ ...req.body, foto });
            res.status(201).json(element);
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar un elemento
const updateElement = async (req, res) => {
    try {
        const element = await Elemento.findByPk(req.params.idelemento);

        if (!element) {
            return res.status(404).json({ message: 'elemento no encontrado' });
        }

        const isSameData = Object.keys(req.body).every(key => element[key] === req.body[key]);

        if (isSameData) {
            return res.status(400).json({ message: 'No se ha hecho ningún cambio en el elemento' });
        }

        const [updated] = await Elemento.update(req.body, {
            where: { idelemento: req.params.idelemento }
        });

        if (updated) {
            const updatedElement = await Elemento.findByPk(req.params.idelemento);
            res.json(updatedElement);
        } else {
            res.status(404).json({ message: 'Error al actualizar el elemento' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un elemento
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

export { getAllElements, getElementById, getElementByName, createElement, updateElement, deleteElement };