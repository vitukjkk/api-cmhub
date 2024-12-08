import { Router } from 'express';
import { CommentsController } from '../controllers/comments-controllers.js';
export const commentsRoutes = Router();
const commentsController = new CommentsController();
commentsRoutes.get('/', commentsController.getComments);
commentsRoutes.get('/:id', commentsController.getComment);
commentsRoutes.post('/', commentsController.createComment);
commentsRoutes.put('/:id', commentsController.updateComment);
commentsRoutes.delete('/:id', commentsController.deleteComment);
