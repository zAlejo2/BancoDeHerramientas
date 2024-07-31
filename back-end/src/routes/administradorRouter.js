import { Router } from 'express';
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/administradorController.js';
// import { loginAdmin } from '../controllers/auth/loginAdministrador.js';

const router = Router();
// TENER EN CUENTA EL MÉTODO PUTCH EN LUGAR DE PUT PORQUE SOLO ACTUALIZA UNA PARTE DEL RECURSO, NO EL RECURSO COMPLETO
router.get('/:documento', getAdminById);
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.put('/:documento', updateAdmin);
router.delete('/:documento', deleteAdmin);
// router.post('/login', loginAdmin);

export default router;
