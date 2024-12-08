import { Router } from 'express';
import { UsersController } from '../controllers/users-controllers.js';
import { errorHandler } from '../middlewares/my-middleware.js';

export const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.get('/', errorHandler, usersController.getUsers);

usersRoutes.get('/:id', errorHandler, usersController.getUser);

usersRoutes.post('/', errorHandler, usersController.createUser);

usersRoutes.put('/:id', errorHandler, usersController.updateUser);

usersRoutes.delete('/:id', errorHandler, usersController.deleteUser);