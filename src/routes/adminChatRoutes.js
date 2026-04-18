import { Router } from 'express';
import * as adminChatController from '../controllers/adminChatController.js';
import { protect, tenantIsolation, requirePermission } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import * as chatValidator from '../validators/chatValidator.js';
import { RESOURCES, ACTIONS } from '../constants/index.js';

const router = Router();

router.use(protect, tenantIsolation);

router.get(
  '/sessions',
  requirePermission(RESOURCES.CHAT, ACTIONS.READ),
  validate(chatValidator.adminListSessions),
  adminChatController.listSessions
);

router.get(
  '/sessions/:sessionId',
  requirePermission(RESOURCES.CHAT, ACTIONS.READ),
  adminChatController.getSessionDetails
);

router.post(
  '/sessions/:sessionId/takeover',
  requirePermission(RESOURCES.CHAT, ACTIONS.UPDATE),
  adminChatController.takeoverSession
);

router.post(
  '/sessions/:sessionId/reply',
  requirePermission(RESOURCES.CHAT, ACTIONS.UPDATE),
  adminChatController.agentReply
);

router.post(
  '/sessions/:sessionId/release',
  requirePermission(RESOURCES.CHAT, ACTIONS.UPDATE),
  adminChatController.releaseSession
);

router.delete(
  '/sessions/:sessionId',
  requirePermission(RESOURCES.CHAT, ACTIONS.DELETE),
  adminChatController.deleteSession
);

export default router;
