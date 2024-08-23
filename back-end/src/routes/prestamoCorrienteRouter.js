import { Router } from "express";
import { lendOut, updateLoan } from "../controllers/prestamoController.js";
import { authenticate, verifyType, verifyRole } from "../middlewares/auth/authMiddleware.js";

const router = Router();

router.post('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), lendOut);
router.put('/', authenticate, verifyType(['administrador']), verifyRole(['admin', 'contratista', 'practicante']), updateLoan);


export default router;