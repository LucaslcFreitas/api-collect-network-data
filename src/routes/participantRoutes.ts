import { Router } from 'express';
import {
    registerParticipant,
    getMe,
    updateMe,
    revokeMe,
    deleteMe,
} from '../controllers/participantController.js';
import { participantRegistrationRateLimit } from '../middleware/rateLimitMiddleware.js';
import { authenticateParticipant } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', participantRegistrationRateLimit, registerParticipant);

router.get('/', authenticateParticipant, getMe);

router.patch('/', authenticateParticipant, updateMe);

router.post('/revoke', authenticateParticipant, revokeMe);

router.delete('/', authenticateParticipant, deleteMe);

export default router;
