import { Router } from 'express';
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/administradorController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAdminById);
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllAdmins);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin']), createAdmin);
router.put('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin']), updateAdmin);
router.delete('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin']), deleteAdmin);

export default router;
