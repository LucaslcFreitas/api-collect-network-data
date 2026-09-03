import { Router } from 'express';
import { uploadBatch } from '../controllers/batchController.js';
import { authenticateParticipant } from '../middleware/authMiddleware.js';
import { batchUploadRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/', authenticateParticipant, batchUploadRateLimit, uploadBatch);

export default router;
