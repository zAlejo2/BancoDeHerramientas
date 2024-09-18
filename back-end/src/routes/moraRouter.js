import { Router } from 'express';
import { getAllMoras } from '../controllers/moraController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllMoras);

export default router;
