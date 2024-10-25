import ExcelJS from 'exceljs';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import sequelize from '../db/connection.js';
import { Cliente, Rol } from '../models/index.js';

const uploadExcelClienteData = async (req, res) => {
    const t = await sequelize.transaction(); // Inicia una transacción
    try {
        const filePath = req.file.path;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0]; // Obtiene la primera hoja

        const jsonData = [];
        worksheet.eachRow((row, rowNumber) => {
            // Convierte cada fila a un objeto
            jsonData.push({
                documento: row.getCell(1).value,
                nombre: row.getCell(2).value,
                correo: row.getCell(3).value,
                numero: row.getCell(4).value,
                contrasena: row.getCell(5).value,
                fechaInicio: row.getCell(6).value,
                fechaFin: row.getCell(7).value,
                roles_idrol: row.getCell(8).value,
                observaciones: row.getCell(9).value,
            });
        });

        const errors = []; // Array para almacenar errores

        // Itera sobre los datos y valida
        for (const item of jsonData) {
            const errorMessages = [];
            const existeRol = await Rol.findOne({ where: {idrol: item.roles_idrol}})
            const existeCliente = await Cliente.findOne({ where: {documento: item.documento}})
            
            if (!item.documento || !item.nombre | !item.correo || !item.numero || !item.fechaInicio || !item.fechaFin || !item.roles_idrol) {
                errorMessages.push('Falta información, revisa que ninguna casilla de documento, nombre, correo, numero, fecha inicio, fecha fin o grupo esté vacía');
            }

            // si el json del correo es un objeto extraer solo el texto para que la inserción funcione
            if (item.correo && typeof item.correo === 'object' && item.correo !== null) {
                item.correo = item.correo.text; // Accede a la propiedad 'text'
            }

            // Validar que el cliente no se encuentre ya registrado
            if (existeCliente) {
                errorMessages.push(`El usuario con documento ${item.documento} ya se encuentra registrado`);
            }

            // Validar que el grupo exista
            if (!existeRol) {
                errorMessages.push('El grupo con el que intenta registrar el usuario no existe');
            }

            // Validar que si no es instructor no tenga contraseña
            if ( existeRol && existeRol.descripcion !== 'instructor' && item.contrasena) {
                errorMessages.push('Si el usuario no es instructor no puede registrar contraseña');
            }

            // encriptar contraseña si es instructor
            if (existeRol && existeRol.descripcion == 'instructor' && item.contrasena) {
                const passwordToHash = item.contrasena.toString(); // Asegúrate de que sea una cadena
                item.contrasena = await bcrypt.hash(passwordToHash, 10);
            }

            // Validar que si es instructor debe registrar contraseña
            // if (existeRol.descripcion == 'instructor' && !item.contrasena) {
            //     errorMessages.push('Si el usuario no es instructor debe registrar contraseña');
            // }

            // Validar documento
            if (!item.documento || isNaN(item.documento)) {
                errorMessages.push('Documento es requerido y debe ser un número');
            }

            // Validar numero
            if (!item.numero || isNaN(item.numero)) {
                errorMessages.push(`Numero es requerido y debe ser un número para cliente ${item.documento}`);
            }

            // Validar correo
            if (item.correo && !validator.isEmail(item.correo)) {
                errorMessages.push(`Correo debe ser un formato válido para cliente ${item.documento}`);
            }

            // Validar fechas
            if (!item.fechaInicio || !validator.isISO8601(item.fechaInicio.toISOString())) {
                errorMessages.push(`Fecha de inicio es requerida y debe ser una fecha válida para el cliente ${item.documento}`);
            }
            if (!item.fechaFin || !validator.isISO8601(item.fechaFin.toISOString())) {
                errorMessages.push(`Fecha de fin es requerida y debe ser una fecha válida para el cliente ${item.documento}`);
            }

            if (errorMessages.length > 0) {
                errors.push({ item, errors: errorMessages });
            } else {
                // Si no hay errores, inserta en la base de datos
                await Cliente.create({
                    documento: item.documento,
                    nombre: item.nombre,
                    correo: item.correo,
                    contrasena: item.contrasena,
                    fechaInicio: item.fechaInicio,
                    fechaFin: item.fechaFin,
                    observaciones: item.observaciones,
                    numero: item.numero,
                    roles_idrol: item.roles_idrol,
                }, { transaction: t });
            }
        }

        // Si hay errores, hacer rollback y enviar los errores
        if (errors.length > 0) {
            await t.rollback();
            return res.status(400).json({ mensaje: 'Errores en los datos', errors });
        }

        // Si todo fue correcto, hacer commit de la transacción
        await t.commit();
        res.status(200).json({ mensaje: 'Clientes registrados sin problemas' });

    } catch (error) {
        console.error(error);
        await t.rollback(); // Deshacer la transacción en caso de error
        return res.status(500).json({ mensaje: 'Error al procesar el archivo' });
    }
};

export {uploadExcelClienteData};
