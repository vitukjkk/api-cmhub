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
const prisma = new PrismaClient();
const commentSchema = z.object({
    message: z.
        string({ message: "ERRO: a mensagem deve ser texto!" }).
        nonempty({ message: "ERRO: a mensagem não pode ser vazia!" }).
        min(3, { message: "ERRO: a mensagem deve ter no mínimo 3 caracteres!" }).
        max(500, { message: "ERRO: a mensagem deve ter no máximo 500 caracteres!" }),
    authorId: z.
        string({ message: "ERRO: o autor deve ser texto!" }).
        nonempty({ message: "ERRO: o autor não pode ser vazio!" }).
        min(3, { message: "ERRO: o autor deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o autor deve ter no máximo 50 caracteres!" }).
        uuid({ message: "ERRO: o autor deve ser um UUID!" }),
    postId: z.
        string({ message: "ERRO: o post deve ser texto!" }).
        nonempty({ message: "ERRO: o post não pode ser vazio!" }).
        min(3, { message: "ERRO: o post deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o post deve ter no máximo 50 caracteres!" }).
        uuid({ message: "ERRO: o post deve ser um UUID!" })
});
export class CommentsController {
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield prisma.comments.findMany();
                res.json(comments);
            }
            catch (error) {
                throw new AppError('Erro ao buscar comentários!', 500);
            }
        });
    }
    getComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const comment = yield prisma.comments.findUnique({
                    where: { id: id }
                });
                if (!comment) {
                    throw new AppError('Comentário não encontrado!', 404);
                }
                res.json(comment);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = commentSchema.parse(req.body);
                const newComment = yield prisma.comments.create({
                    data: {
                        message: parsedData.message,
                        authorId: parsedData.authorId,
                        postId: parsedData.postId
                    }
                });
                res.json(newComment);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const parsedData = commentSchema.parse(req.body);
                const updatedComment = yield prisma.comments.update({
                    where: { id: id },
                    data: {
                        message: parsedData.message,
                        authorId: parsedData.authorId,
                        postId: parsedData.postId
                    }
                });
                res.json(updatedComment);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield prisma.comments.delete({
                    where: { id: id }
                });
                res.json({ message: 'Comentário deletado com sucesso!' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}