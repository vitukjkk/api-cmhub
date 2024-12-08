import { Router } from 'express';
import { UsersController } from '../controllers/users-controllers.js';
import { myMiddleware } from '../middlewares/my-middleware.js';

export const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.get('/', myMiddleware, usersController.getUsers);

usersRoutes.get('/:id', myMiddleware, usersController.getUser);

usersRoutes.post('/', myMiddleware, usersController.createUser);

usersRoutes.put('/:id', myMiddleware, usersController.updateUser);

usersRoutes.delete('/:id', myMiddleware, usersController.deleteUser);