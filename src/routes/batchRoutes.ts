import { Router } from 'express';
import {
	getBatchesController,
	getMeasurementsController,
	uploadBatch,
} from '../controllers/batchController.js';
import {
	authenticateParticipant,
	requireAdmin,
} from '../middleware/authMiddleware.js';
// import { batchUploadRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.get('/getBatches', authenticateParticipant, requireAdmin, getBatchesController);
router.get('/getMeasurements', authenticateParticipant, requireAdmin, getMeasurementsController);

router.post('/', authenticateParticipant, uploadBatch);
// router.post('/', authenticateParticipant, batchUploadRateLimit, uploadBatch);

export default router;
