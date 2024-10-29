import { Router } from 'express';
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, changeContrasenaAdmin, changeCorreoAdmin, getInfoAdmin } from '../controllers/administradorController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/info-admin', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getInfoAdmin);
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllAdmins);
router.get('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAdminById);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin']), createAdmin);
router.put('/cambiar-contrasena', authenticate, verifyType(['administrador']), verifyRole(['admin']), changeContrasenaAdmin);
router.put('/cambiar-correo', authenticate, verifyType(['administrador']), verifyRole(['admin']), changeCorreoAdmin);
router.put('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin']), updateAdmin);
router.delete('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin']), deleteAdmin);

export default router;
