import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/app-error.js';
import z from 'zod';

const prisma = new PrismaClient();
const messageSchema = z.object({
    message:
        z.
            string({message: "ERRO: a mensagem deve ser texto!"}).
            nonempty({message: "ERRO: a mensagem não pode ser vazia!"}).
            min(3, {message: "ERRO: a mensagem deve ter no mínimo 3 caracteres!"}).
            max(500, {message: "ERRO: a mensagem deve ter no máximo 500 caracteres!"}),
    authorId:
        z.
            string({message: "ERRO: o autor deve ser texto!"}).
            nonempty({message: "ERRO: o autor não pode ser vazio!"}).
            min(3, {message: "ERRO: o autor deve ter no mínimo 3 caracteres!"}).
            max(50, {message: "ERRO: o autor deve ter no máximo 50 caracteres!"}).
            uuid({message: "ERRO: o autor deve ser um UUID!"}),
    destinatarioId:
        z.
            string({message: "ERRO: o destinatário deve ser texto!"}).
            nonempty({message: "ERRO: o destinatário não pode ser vazio!"}).
            min(3, {message: "ERRO: o destinatário deve ter no mínimo 3 caracteres!"}).
            max(50, {message: "ERRO: o destinatário deve ter no máximo 50 caracteres!"}).
            uuid({message: "ERRO: o destinatário deve ser um UUID!"})
});

export class MessagesController {
    async getMessages(req: Request, res: Response, next : NextFunction) {
        try {
            const messages = await prisma.mensagens.findMany();
            res.json(messages);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao criar mensagem!', 500));
            }        
        }
    };

    async getMessage(req: Request, res: Response, next : NextFunction) {
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
    };

    async createMessage(req: Request, res: Response, next : NextFunction) {
        try {
            const parsedData = messageSchema.parse(req.body);

            const newMessage = await prisma.mensagens.create({
                data: { 
                    message: parsedData.message,
                    authorId: parsedData.authorId,
                    destinatarioId: parsedData.destinatarioId
                }
            });

            res.json(newMessage);
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao criar mensagem!', 500));
            }
        }
    };

    async updateMessage(req: Request, res: Response, next : NextFunction) {
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
                next(new AppError('Erro ao atualizar mensagem!', 500));
            }
        }
    };

    async deleteMessage(req: Request, res: Response, next : NextFunction) {
        try {
            const id = req.params.id;
            await prisma.mensagens.delete({
                where: { id: id }
            });
            res.send(`Mensagem com ID ${req.params.id} deletada!`);
        } catch (error) {
            next(error);
        }
    };
};