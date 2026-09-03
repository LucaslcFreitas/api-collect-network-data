import { Router } from 'express';
import {
    registerParticipant,
    getMe,
    updateMe,
} from '../controllers/participantController.js';
import { participantRegistrationRateLimit } from '../middleware/rateLimitMiddleware.js';
import { authenticateParticipant } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', participantRegistrationRateLimit, registerParticipant);

router.get('/', authenticateParticipant, getMe);

router.patch('/', authenticateParticipant, updateMe);

export default router;
