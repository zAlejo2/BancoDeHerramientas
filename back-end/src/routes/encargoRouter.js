import { Router } from 'express';
import { createEncargo, cancelEncargo, getInstructorEncargos } from '../controllers/encargoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), getInstructorEncargos);
router.post('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), createEncargo);
router.delete('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), cancelEncargo);

export default router;