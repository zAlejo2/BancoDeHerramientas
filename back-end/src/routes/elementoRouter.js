import { Router } from 'express';
import { getAllElements, getElementById, getElementByName, createElement, updateElement, deleteElement } from '../controllers/elementoController.js';

const router = Router();

router.get('/by-id/:idelemento', getElementById); // Ruta específica para obtener por ID
router.get('/by-description/:descripcion', getElementByName); // Ruta específica para obtener por descripción
router.get('/', getAllElements);
router.post('/', createElement);
router.put('/:idelemento', updateElement);
router.delete('/:idelemento', deleteElement);

export default router;