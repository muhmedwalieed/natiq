import { Router } from 'express';
import channelController from '../controllers/channelController.js';

const router = Router();

router.post('/telegram/webhook', channelController.telegramWebhook);
router.post('/whatsapp/mock-webhook', channelController.whatsappMockWebhook);

export default router;
