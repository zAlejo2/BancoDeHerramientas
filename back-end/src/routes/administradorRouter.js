import { Router } from 'express';
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/administradorController.js';
import { loginAdmin } from '../controllers/auth/loginAdministrador.js';

const router = Router();

router.get('/:documento', getAdminById);
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.put('/:documento', updateAdmin);
router.delete('/:documento', deleteAdmin);
router.post('/login', loginAdmin);

export default router;
