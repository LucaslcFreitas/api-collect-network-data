import { Router } from 'express';
import {
	getBatchesController,
	getMeasurementsController,
	uploadBatch,
} from '../controllers/batchController.js';
import {
	authenticateParticipant,
} from '../middleware/authMiddleware.js';

const router = Router();

router.get('/getBatches', getBatchesController);
router.get('/getMeasurements', getMeasurementsController);

router.post('/', authenticateParticipant, uploadBatch);

export default router;
