import { Router } from 'express';
import { getAllElements, getElementById, createElement, updateElement, deleteElement } from '../controllers/elementoController.js';

const router = Router();

router.get('/:idelemento', getElementById);
router.get('/', getAllElements);
router.post('/', createElement);
router.put('/:idelemento', updateElement);
router.delete('/:idelemento', deleteElement);

export default router;