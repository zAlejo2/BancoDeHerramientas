import { Router } from "express";
import { lendOut, updateLoan, getLoans } from "../controllers/prestamoController.js";
import { authenticate, verifyType, verifyRole } from "../middlewares/auth/authMiddleware.js";
import PrestamoCorriente from "../models/prestamocorrienteModel.js";

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), lendOut);
router.put('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), updateLoan);
router.get('/:documento', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), getLoans);
  
export default router;