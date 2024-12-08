import { Router } from 'express';
import { PostsController } from '../controllers/posts-controllers.js';

export const postsRoutes = Router();
const postsController = new PostsController();

postsRoutes.get('/', postsController.getPosts);
postsRoutes.get('/:id', postsController.getPost);
postsRoutes.post('/', postsController.createPost);
postsRoutes.put('/:id', postsController.updatePost);
postsRoutes.delete('/:id', postsController.deletePost);