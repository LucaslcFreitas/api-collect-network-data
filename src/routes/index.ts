import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import participantRoutes from './participantRoutes.js';

const router = Router();

router.get('/health', healthCheck);

router.use('/participants', participantRoutes);

export default router;