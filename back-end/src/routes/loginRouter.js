import { Router } from 'express';
import { loginAdmin } from '../controllers/auth/loginAdministrador.js';

const router = Router();

router.post('/login', loginAdmin);

export default router;