import { Router } from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clienteController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getClientById);
router.get('/', /*authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']),*/ getAllClients);
router.post('/', /*authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']),*/ createClient);
router.put('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista']), updateClient);
router.delete('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista' ]), deleteClient);

export default router;