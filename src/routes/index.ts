import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import participantRoutes from './participantRoutes.js';
import batchRoutes from './batchRoutes.js';
import dataRoutes from './dataRoutes.js';
import environmentRoutes from './environmentRoutes.js';

const router = Router();

router.get('/health', healthCheck);

router.use('/participant', participantRoutes);

router.use('/batches', batchRoutes);

router.use('/data', dataRoutes);

router.use('/environment', environmentRoutes);

export default router;
