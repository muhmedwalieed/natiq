import { Router } from 'express';
import authController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as authValidator from '../validators/authValidator.js';

const router = Router();

router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', validate(authValidator.login), authController.login);
router.get('/companies', authController.getPublicCompanies);
router.get('/me', protect, authController.getMe);

export default router;
