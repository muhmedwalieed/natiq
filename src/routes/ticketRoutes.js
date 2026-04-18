import { Router } from 'express';
import ticketController from '../controllers/ticketController.js';
import { protect, tenantIsolation, requirePermission } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as ticketValidator from '../validators/ticketValidator.js';
import { RESOURCES, ACTIONS } from '../constants/index.js';

const router = Router();

router.use(protect, tenantIsolation);

router.get(
  '/',
  requirePermission(RESOURCES.TICKETS, ACTIONS.READ),
  validate(ticketValidator.listCustomerTickets),
  ticketController.getMyTickets
);

router.post(
  '/:ticketId/reply',
  requirePermission(RESOURCES.TICKETS, ACTIONS.UPDATE),
  validate(ticketValidator.customerReply),
  ticketController.customerReply
);

router.post(
  '/:ticketId/feedback',
  requirePermission(RESOURCES.TICKETS, ACTIONS.UPDATE),
  validate(ticketValidator.submitFeedback),
  ticketController.submitFeedback
);

export default router;
