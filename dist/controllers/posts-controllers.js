var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/app-error.js';
import z from 'zod';
import { authenticateToken } from '../middlewares/my-middleware.js';
const prisma = new PrismaClient();
const postSchema = z.object({
    title: z.
        string({ message: "ERRO: o título deve ser texto!" }).
        nonempty({ message: "ERRO: o título não pode ser vazio!" }).
        min(3, { message: "ERRO: o título deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o título deve ter no máximo 50 caracteres!" }),
    content: z.
        string({ message: "ERRO: o conteúdo deve ser texto!" }).
        nonempty({ message: "ERRO: o conteúdo não pode ser vazio!" }).
        min(3, { message: "ERRO: o conteúdo deve ter no mínimo 3 caracteres!" }).
        max(500, { message: "ERRO: o conteúdo deve ter no máximo 500 caracteres!" }),
    authorId: z.
        string({ message: "ERRO: o autor deve ser texto!" }).
        nonempty({ message: "ERRO: o autor não pode ser vazio!" }).
        min(3, { message: "ERRO: o autor deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o autor deve ter no máximo 50 caracteres!" }).
        uuid({ message: "ERRO: o autor deve ser um UUID!" }),
    comments: z.
        array(z.object({
        content: z.
            string({ message: "ERRO: o conteúdo do comentário deve ser texto!" }).
            nonempty({ message: "ERRO: o conteúdo do comentário não pode ser vazio!" }).
            min(3, { message: "ERRO: o conteúdo do comentário deve ter no mínimo 3 caracteres!" }).
            max(500, { message: "ERRO: o conteúdo do comentário deve ter no máximo 500 caracteres!" }),
        authorId: z.
            string({ message: "ERRO: o autor do comentário deve ser texto!" }).
            nonempty({ message: "ERRO: o autor do comentário não pode ser vazio!" }).
            min(3, { message: "ERRO: o autor do comentário deve ter no mínimo 3 caracteres!" }).
            max(50, { message: "ERRO: o autor do comentário deve ter no máximo 50 caracteres!" }).
            uuid({ message: "ERRO: o autor do comentário deve ser um UUID!" }),
    }), { message: "ERRO: os comentários devem ser um array de objetos!" }),
});
export class PostsController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield prisma.post.findMany();
                res.json(posts);
            }
            catch (error) {
                throw new AppError('Erro ao buscar posts!', 500);
            }
        });
    }
    getPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const post = yield prisma.post.findUnique({
                    where: { id: id }
                });
                if (!post) {
                    throw new AppError('Post não encontrado!', 404);
                }
                res.json(post);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = postSchema.parse(req.body);
                authenticateToken(req, res, next);
                const newPost = yield prisma.post.create({
                    data: {
                        title: parsedData.title,
                        content: parsedData.content,
                        authorId: parsedData.authorId,
                    }
                });
                res.status(201).json(newPost);
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    next(new AppError(error.errors[0].message, 400));
                }
                else {
                    next(new AppError('Erro ao criar post!', 500));
                }
            }
        });
    }
    updatePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const parsedData = postSchema.parse(req.body);
                const updatedPost = yield prisma.post.update({
                    where: { id: id },
                    data: {
                        title: parsedData.title,
                        content: parsedData.content,
                        authorId: parsedData.authorId,
                    }
                });
                res.json(updatedPost);
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    next(new AppError(error.errors[0].message, 400));
                }
                else {
                    next(new AppError('Erro ao atualizar post!', 500));
                }
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield prisma.post.delete({
                    where: { id: id }
                });
                res.send(`Post com ID ${req.params.id} deletado!`);
            }
            catch (error) {
                next(new AppError('Erro ao deletar post!', 500));
            }
        });
    }
}
