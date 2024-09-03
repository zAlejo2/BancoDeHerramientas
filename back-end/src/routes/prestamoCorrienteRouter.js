import { Router } from 'express';
import { getLoans, createLoan, addOrUpdate, deleteLoan, getLoanElements } from '../controllers/prestamoCorrienteController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createLoan);
router.post('/addElements/:idprestamo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), addOrUpdate);
router.get('/:idprestamo/elementos', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getLoanElements);
router.delete('/:idprestamo', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), deleteLoan);

export default router;