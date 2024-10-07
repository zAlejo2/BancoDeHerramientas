import { Router } from 'express';
import { createReintegro, getAllReintegros } from '../controllers/bajaController.js';
import { authenticate, verifyType, verifyRole, verifyArea } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createReintegro);
router.get('/reintegros', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), verifyArea, getAllReintegros);

export default router;