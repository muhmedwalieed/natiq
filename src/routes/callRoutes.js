import { Router } from 'express';
import callController from '../controllers/callController.js';
import { protect, tenantIsolation, allowRoles } from '../middlewares/authMiddleware.js';
import { ROLES } from '../constants/index.js';

const router = Router();

// All routes require authentication
router.use(protect, tenantIsolation);

// Agent: save a call record after it ends
router.post(
  '/',
  allowRoles(ROLES.AGENT),
  callController.saveCall
);

// Agent: get their own call history
router.get(
  '/my-history',
  allowRoles(ROLES.AGENT),
  callController.getCallHistory
);

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set up basic multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'calls');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.callId}-${Date.now()}-recording.webm`);
  }
});
const upload = multer({ storage });

// Manager/TeamLeader: get all company calls
router.get(
  '/company',
  allowRoles(ROLES.COMPANY_MANAGER, ROLES.TEAM_LEADER, ROLES.PLATFORM_SUPER_ADMIN),
  callController.getCompanyCalls
);

// Agent: upload recording for a specific call
router.post(
  '/upload-recording/:callId',
  allowRoles(ROLES.AGENT),
  upload.single('audio'),
  callController.uploadRecording
);

export default router;
