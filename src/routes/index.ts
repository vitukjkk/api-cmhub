import express, { Router } from 'express';

import { usersRoutes } from './users-routes.js';
import { postsRoutes } from './posts-routes.js';

export const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/posts", postsRoutes);
