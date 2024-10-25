import express from 'express';
import upload from '../middlewares/excelMiddleware.js'; // Middleware para subir Excel
import { uploadExcelClienteData } from '../controllers/importarExcelController.js';

const router = express.Router();

// Ruta para subir y procesar el archivo Excel
router.post('/cliente', upload.single('file'), uploadExcelClienteData);

export default router;
