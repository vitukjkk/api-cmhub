import { Router } from 'express';
import { authenticateToken } from '../middlewares/my-middleware.js';
// IMPORTA AS ROTAS
import { authRoutes } from './auth-routes.js';
import { usersRoutes } from './users-routes.js';
import { postsRoutes } from './posts-routes.js';
import { commentsRoutes } from './comments-routes.js';
import { messagesRoutes } from './messages-routes.js';
export const routes = Router();
routes.use("/auth", authRoutes);
routes.use("/users", authenticateToken, usersRoutes);
routes.use("/posts", postsRoutes);
routes.use("/comments", commentsRoutes);
routes.use("/messages", messagesRoutes);
