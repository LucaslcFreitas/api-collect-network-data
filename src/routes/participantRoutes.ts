import { Router } from 'express';
import {
    registerParticipant,
    getMe,
    updateMe,
    revokeMe,
    deleteMe,
    getAllParticipantsController,
} from '../controllers/participantController.js';
import {
    authenticateParticipant,
    requireAdmin,
} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', registerParticipant);
// router.post('/', participantRegistrationRateLimit, registerParticipant);

router.get('/', authenticateParticipant, getMe);

router.get(
    '/getAllParticipants',
    authenticateParticipant,
    requireAdmin,
    getAllParticipantsController,
);

router.patch('/', authenticateParticipant, updateMe);

router.post('/revoke', authenticateParticipant, revokeMe);

router.delete('/', authenticateParticipant, deleteMe);

export default router;
