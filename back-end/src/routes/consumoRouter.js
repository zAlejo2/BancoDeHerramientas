import { Router } from 'express';
import { createConsumption, addOrUpdate, getAllConsumtions, getConsumptionById, deleteConsumption } from '../controllers/consumoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createConsumption);
router.post('/addElements/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), addOrUpdate);
// router.get('/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getConsumptionById);
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllConsumtions);
router.delete('/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), deleteConsumption);

export default router;
