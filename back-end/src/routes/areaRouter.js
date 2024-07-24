import { Router } from 'express';
import { getAllAreas, getAreaById, createArea } from '../controllers/areaController.js';

const router = Router();

router.get('/:idrol', getAreaById);
router.get('/', getAllAreas);
router.post('/', createArea);

export default router;