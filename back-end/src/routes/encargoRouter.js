import { Router } from 'express';
import { createEncargo, cancelEncargo, getInstructorEncargos, getAdminEncargos, rejectEncargo, acceptEncargo, reclaimEncargo, cancelAceptar } from '../controllers/encargoController.js';
import { authenticate, verifyType, verifyRole, verifyArea } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), getInstructorEncargos);
router.get('/admin', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), verifyArea, getAdminEncargos);
router.post('/', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), createEncargo);
router.post('/aceptar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), verifyArea, acceptEncargo);
router.post('/reclamar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), verifyArea, reclaimEncargo);
router.post('/rechazar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), verifyArea, rejectEncargo);
router.post('/cancel-aceptar/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']),verifyArea, cancelAceptar);
router.delete('/:idencargo', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), cancelEncargo);

export default router;