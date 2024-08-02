import { Router } from 'express';
import { getAllElements, getElementById, getElementByName, createElement, updateElement, deleteElement } from '../controllers/elementoController.js';
import { authenticate, verifyType, verifyRole } from '../middlewares/auth/authMiddleware.js';

const router = Router();

router.get('/by-id/:idelemento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getElementById); 
router.get('/by-description/:descripcion', authenticate, verifyType(['administrador', 'cliente']), verifyRole(['admin', 'contratista', 'practicante', 'instructor']), getElementByName); 
router.get('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getAllElements);
router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), createElement);
router.put('/:idelemento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista']), updateElement);
router.delete('/:idelemento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista']), deleteElement);

export default router;