import { Router } from 'express';
import {
    addMorphologyEnvironment,
    addTopographyEnvironment,
    getEnvironment,
} from '../controllers/environmentController.js';
import { authenticateParticipant } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getEnvironment);
router.post('/morphology', authenticateParticipant, addMorphologyEnvironment);
router.post('/topography', authenticateParticipant, addTopographyEnvironment);

export default router;