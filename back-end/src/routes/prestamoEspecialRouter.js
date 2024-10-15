import { Router } from 'express';
import { createPrestamoEspecial } from '../controllers/prestamoEspecialController.js';
import { authenticate, verifyType, verifyRole, verifyArea } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), verifyArea, createPrestamoEspecial);

export default router;