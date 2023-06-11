import { Router } from 'express';

import * as userController from '../controllers/userController.js';

const router = Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { router as userRoutes };
