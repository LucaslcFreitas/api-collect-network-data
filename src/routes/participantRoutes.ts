import { Router } from 'express';
import { registerParticipant } from '../controllers/participantController.js';
import { participantRegistrationRateLimit } from '../middleware/rateLimitMiddleware.js';
import {
    authenticateParticipant,
    AuthenticatedRequest,
} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', participantRegistrationRateLimit, registerParticipant);

router.get('/me', authenticateParticipant, (req, res) => {
    const authenticatedRequest = req as AuthenticatedRequest;

    res.status(200).json({
        participantId: authenticatedRequest.participantId,
    });
});

export default router;
