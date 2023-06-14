import { Router } from 'express';

import * as authController from '../controllers/authController.js';
import { loginLimiter } from '../middleware/loginLimiter.js';

const router = Router();

router.route('/').post(loginLimiter, authController.login);

router.route('/refresh').get(authController.refresh);

router.route('/logout').get(authController.logout);

export { router as authRoutes };
