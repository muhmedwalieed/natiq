import { Router } from 'express';
import analyticsController from '../controllers/analyticsController.js';
import { protect, tenantIsolation, requirePermission, allowRoles } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as analyticsValidator from '../validators/analyticsValidator.js';
import { RESOURCES, ACTIONS, ROLES } from '../constants/index.js';

const router = Router();

router.use(protect, tenantIsolation);

router.get(
  '/overview',
  requirePermission(RESOURCES.ANALYTICS, ACTIONS.READ),
  validate(analyticsValidator.overview),
  analyticsController.getOverview
);

router.get(
  '/agents/overview',
  allowRoles(ROLES.PLATFORM_SUPER_ADMIN, ROLES.COMPANY_MANAGER, ROLES.TEAM_LEADER),
  validate(analyticsValidator.overview),
  analyticsController.getAgentsOverview
);

export default router;
