import { Router } from 'express';
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/administradorController.js';

const router = Router();

router.get('/:documento', getAdminById);
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.put('/:documento', updateAdmin);
router.delete('/:documento', deleteAdmin);

export default router;
