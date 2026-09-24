import { Router } from 'express';
import {
    addMorphologyOption,
    addTopographyOption,
    getEnvironmentOptions,
} from '../controllers/environmentController.js';
import { authenticateParticipant } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getEnvironmentOptions);
router.post('/morphology', authenticateParticipant, addMorphologyOption);
router.post('/topography', authenticateParticipant, addTopographyOption);

export default router;