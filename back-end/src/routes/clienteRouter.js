import { Router } from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clienteController.js';

const router = Router();

router.get('/:documento', getClientById);
router.get('/', getAllClients);
router.post('/', createClient);
router.put('/:documento', updateClient);
router.delete('/:documento', deleteClient);

export default router;