import { Request, Response, NextFunction } from 'express';
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
    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const messages = await prisma.mensagens.findMany();
            res.json(messages);
        } catch (error) {
            next(new AppError('Erro ao buscar mensagens!', 500));
        }
    }

    async getMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const message = await prisma.mensagens.findUnique({
                where: { id: id }
            });
            if (!message) {
                throw new AppError('Mensagem não encontrada!', 404);
            }
            res.json(message);
        } catch (error) {
            next(error);
        }
    }

    async createMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const parsedData = messageSchema.parse(req.body);

            const newMessage = await prisma.mensagens.create({
                data: {
                    message: parsedData.message,
                    authorId: parsedData.authorId,
                    destinatarioId: parsedData.destinatarioId,
                    data: new Date()
                }
            });

            res.status(201).json(newMessage);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao criar mensagem!', 500));
            }
        }
    }

    async updateMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const parsedData = messageSchema.parse(req.body);

            const updatedMessage = await prisma.mensagens.update({
                where: { id: id },
                data: {
                    message: parsedData.message,
                    authorId: parsedData.authorId,
                    destinatarioId: parsedData.destinatarioId
                }
            });

            res.json(updatedMessage);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao editar mensagem!', 500));
            }
        }
    }

    async deleteMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            await prisma.mensagens.delete({
                where: { id: id }
            });
            res.status(204).send();
        } catch (error) {
            next(new AppError('Erro ao deletar mensagem!', 500));
        }
    }
}