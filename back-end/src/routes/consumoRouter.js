import { Router } from 'express';
import { createConsumption, getAllConsumtions, getConsumptionById, addElementsToConsumption } from '../controllers/consumoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createConsumption);
router.get('/:idconsumo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getConsumptionById);
router.post('/addElements', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), addElementsToConsumption);
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllConsumtions);

export default router;
