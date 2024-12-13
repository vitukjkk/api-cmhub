import { Router } from 'express';
import { UsersController } from '../controllers/users-controllers.js';
export const usersRoutes = Router();
const usersController = new UsersController();
usersRoutes.get('/', usersController.getUsers);
usersRoutes.get('/:username', usersController.getUser);
usersRoutes.post('/', usersController.createUser);
usersRoutes.put('/:id', usersController.updateUser);
usersRoutes.delete('/:id', usersController.deleteUser);
