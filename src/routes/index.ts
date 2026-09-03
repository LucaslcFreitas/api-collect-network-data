import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import participantRoutes from './participantRoutes.js';
import batchRoutes from './batchRoutes.js';

const router = Router();

router.get('/health', healthCheck);

router.use('/participants', participantRoutes);

router.use('/batches', batchRoutes);

export default router;
