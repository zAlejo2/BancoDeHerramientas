import { Router } from 'express';
import { getAllAreas, getAreaById, createArea, updateArea, deleteArea } from '../controllers/areaController.js';
import { authenticate, verifyType, verifyRole, verifyArea } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/:idarea', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), verifyArea, getAreaById);
router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']),  getAllAreas);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin']), verifyArea, createArea);
router.put('/:idarea', authenticate, verifyType(['administrador']), verifyRole(['admin']), updateArea);
router.delete('/:idarea', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), deleteArea);

export default router;