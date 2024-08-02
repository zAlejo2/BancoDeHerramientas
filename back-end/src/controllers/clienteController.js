import { Cliente, Rol } from '../models/index.js';
import upload from '../middlewares/fotoClienteMiddleware.js';
import bcrypt from 'bcryptjs';

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
        // Manejar la carga de archivos
        upload.single('foto')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            const userExisting = await Cliente.findByPk(req.body.documento);
            if (userExisting) {
                return res.status(400).json({ message: 'El Cliente ingresado ya existe' });
            }

            if (req.body.contrasena !== '') {
                req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
            }

            const rolMissing = await req.body.roles_idrol;

            if( rolMissing == '') {
                return res.status(400).json({ message: 'El rol del cliente no puede estar vacío'});
            }

            const rolExist = await Rol.findByPk(req.body.roles_idrol);

            if(!rolExist) {
                return res.status(400).json({ message: 'El rol ingresado no existe' });
            }

            // Obtener el nombre del archivo de la imagen subida
            const foto = req.file ? req.file.filename : null;

            const user = await Cliente.create({ ...req.body, foto });
            res.status(201).json(user);
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

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