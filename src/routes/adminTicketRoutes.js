import { Router } from 'express';
import adminTicketController from '../controllers/adminTicketController.js';
import { protect, tenantIsolation, requirePermission } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as ticketValidator from '../validators/ticketValidator.js';
import { RESOURCES, ACTIONS } from '../constants/index.js';

const router = Router();

router.use(protect, tenantIsolation);

router.get(
  '/',
  requirePermission(RESOURCES.TICKETS, ACTIONS.READ),
  validate(ticketValidator.listTickets),
  adminTicketController.listTickets
);

router.get(
  '/:ticketId',
  requirePermission(RESOURCES.TICKETS, ACTIONS.READ),
  adminTicketController.getTicket
);

router.patch(
  '/:ticketId',
  requirePermission(RESOURCES.TICKETS, ACTIONS.UPDATE),
  validate(ticketValidator.updateTicket),
  adminTicketController.updateTicket
);

router.post(
  '/:ticketId/notes',
  requirePermission(RESOURCES.TICKETS, ACTIONS.UPDATE),
  validate(ticketValidator.addNote),
  adminTicketController.addNote
);

export default router;
