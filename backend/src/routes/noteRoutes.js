import { Router } from 'express';

import * as noteController from '../controllers/noteController.js';

const router = Router();

router
  .route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

export { router as noteRoutes };
