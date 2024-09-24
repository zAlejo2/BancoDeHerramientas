import { Router } from 'express';
import { getAllAreas, getAreaById, createArea } from '../controllers/areaController.js';
import { authenticate, verifyType, verifyRole, verifyArea } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/:idarea', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), verifyArea, getAreaById);
router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), verifyArea, getAllAreas);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin']), verifyArea, createArea);

export default router;