import { Router } from 'express';
import { authenticateParticipant } from '../middleware/authMiddleware.js';
import { getMyData } from '../controllers/dataController.js';

const router = Router();

router.get('/', authenticateParticipant, getMyData);

export default router;
