import { Router } from 'express';
import { authenticateParticipant, requireAdmin } from '../middleware/authMiddleware.js';
import { getAll, getMyData } from '../controllers/dataController.js';

const router = Router();

router.get('/', authenticateParticipant, getMyData);
router.get('/getAll', authenticateParticipant, requireAdmin, getAll);

export default router;
