import express from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import tokenRoutes from './accessToken';
import organisationRoutes from './organisation';
import ClientRoutes from './Client';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/token', tokenRoutes);
router.use('/organisation', organisationRoutes);
router.use('/client', ClientRoutes);

export default router;