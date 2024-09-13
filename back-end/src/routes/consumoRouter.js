import { Router } from 'express';
import { createConsumption, addElements, getAllConsumptions, deleteConsumption } from '../controllers/consumoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createConsumption);
router.post('/addElements/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), addElements);
// router.get('/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getConsumptionById);
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllConsumptions);
router.delete('/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), deleteConsumption);

export default router;
