import { Router } from 'express';
import verifyJWT from '../middleware/verifyJWT.js';

import * as userController from '../controllers/userController.js';

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { router as userRoutes };
