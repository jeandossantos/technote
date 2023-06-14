import { Router } from 'express';
import * as noteController from '../controllers/noteController.js';

import verifyJWT from '../middleware/verifyJWT.js';

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

export { router as noteRoutes };
