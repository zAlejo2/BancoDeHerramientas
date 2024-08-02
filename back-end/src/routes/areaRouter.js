import { Router } from 'express';
import { getAllAreas, getAreaById, createArea } from '../controllers/areaController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/:idarea', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAreaById);
router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), getAllAreas);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin']), createArea);

export default router;