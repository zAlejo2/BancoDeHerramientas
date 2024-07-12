import { Router } from 'express';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/rolController.js';

const router = Router();

router.get('/:idrol', getRoleById);
router.get('/', getAllRoles);
router.post('/', createRole);
router.put('/:idrol', updateRole);
router.delete('/:idrol', deleteRole);

export default router;