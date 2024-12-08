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
const messageSchema = z.object({
    message: z.string().nonempty({ message: "ERRO: a mensagem não pode ser vazia!" }),
    authorId: z.string().uuid({ message: "ERRO: o autor deve ser um UUID!" }),
    destinatarioId: z.string().uuid({ message: "ERRO: o destinatário deve ser um UUID!" })
});
export class MessagesController {
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield prisma.mensagens.findMany();
                res.json(messages);
            }
            catch (error) {
                next(new AppError('Erro ao buscar mensagens!', 500));
            }
        });
    }
    getMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const message = yield prisma.mensagens.findUnique({
                    where: { id: id }
                });
                if (!message) {
                    throw new AppError('Mensagem não encontrada!', 404);
                }
                res.json(message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = messageSchema.parse(req.body);
                const newMessage = yield prisma.mensagens.create({
                    data: {
                        message: parsedData.message,
                        authorId: parsedData.authorId,
                        destinatarioId: parsedData.destinatarioId,
                        data: new Date()
                    }
                });
                res.status(201).json(newMessage);
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    next(new AppError(error.errors[0].message, 400));
                }
                else {
                    next(new AppError('Erro ao criar mensagem!', 500));
                }
            }
        });
    }
    updateMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const parsedData = messageSchema.parse(req.body);
                const updatedMessage = yield prisma.mensagens.update({
                    where: { id: id },
                    data: {
                        message: parsedData.message,
                        authorId: parsedData.authorId,
                        destinatarioId: parsedData.destinatarioId
                    }
                });
                res.json(updatedMessage);
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    next(new AppError(error.errors[0].message, 400));
                }
                else {
                    next(new AppError('Erro ao editar mensagem!', 500));
                }
            }
        });
    }
    deleteMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield prisma.mensagens.delete({
                    where: { id: id }
                });
                res.status(204).send();
            }
            catch (error) {
                next(new AppError('Erro ao deletar mensagem!', 500));
            }
        });
    }
}
