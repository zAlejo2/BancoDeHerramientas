import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/usuarioController.js';

const router = Router();

router.get('/:documento', getUserById);
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:documento', updateUser);
router.delete('/:documento', deleteUser);

export default router;
