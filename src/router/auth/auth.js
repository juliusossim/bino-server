import express from 'express';

import authController from '../../http/controllers/auth/auth';

const router = express.Router();

router.post('/signup', authController.registerUser);
router.post('/confirm-email/:token', authController.confirmEmail);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

export default router;
