import { Router } from 'express';
import platformController from '../controllers/platformController.js';
import { protect, allowRoles } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as companyValidator from '../validators/companyValidator.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(protect, allowRoles(ROLES.PLATFORM_SUPER_ADMIN));

router.post(
  '/companies',
  validate(companyValidator.createCompany),
  platformController.createCompany
);

router.get('/companies', platformController.listCompanies);

router.get('/companies/:id', platformController.getCompany);

router.patch(
  '/companies/:id',
  validate(companyValidator.updateCompany),
  platformController.updateCompany
);

router.post('/companies/:id/initial-admin', platformController.createInitialAdmin);

export default router;
