import { Router } from 'express';
import { createEncargo, cancelEncargo, getInstructorEncargos, getAdminEncargos, rejectEncargo, acceptEncargo } from '../controllers/encargoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), getInstructorEncargos);
router.get('/admin', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAdminEncargos);
router.post('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), createEncargo);
router.post('/aceptar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), acceptEncargo);
router.delete('/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), cancelEncargo);
router.post('/rechazar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), rejectEncargo);


export default router;