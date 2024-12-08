import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/app-error.js';
import z from 'zod';

const prisma = new PrismaClient();

const userSchema = z.object({
    name:
        z.
            string({message: "ERRO: o nome deve ser texto!"}).
            nonempty({message: "ERRO: o nome não pode ser vazio!"}).
            min(3, {message: "ERRO: o nome deve ter no mínimo 3 caracteres!"}).
            max(50, {message: "ERRO: o nome deve ter no máximo 50 caracteres!"}),
    username:
        z.
            string({message: "ERRO: o username deve ser texto!"}).
            nonempty({message: "ERRO: o username não pode ser vazio!"}).
            min(3, {message: "ERRO: o username deve ter no mínimo 3 caracteres!"}).
            max(30, {message: "ERRO: o username deve ter no máximo 30 caracteres!"})
});

export class UsersController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.json(users);
        } catch (error) {
            throw new AppError('Erro ao buscar usuários!', 500);
        }
    }

    async getUser(req: Request, res: Response, next : NextFunction) {
        try {
            const id = req.params.id;
            const user = await prisma.user.findUnique({
                where: { id: id }
            });
            
            if (!user) {
                throw new AppError('Usuário não encontrado!', 404);
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next : NextFunction) {
        try {

            const parsedData = userSchema.parse(req.body);

            const newUser = await prisma.user.create({
                data: { 
                    name: parsedData.name,
                    username: parsedData.username
                }
            });

            res.status(201).json(newUser);
        } catch (error) {
            if(error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao criar usuário!', 500));
            }
        }
    }

    async updateUser(req: Request, res: Response, next : NextFunction) {

        try {
            const id = req.params.id;
            const parsedData = userSchema.parse(req.body);
            
            await prisma.user.update({
                where: { id: id },
                data: {
                    name: parsedData.name,
                    username: parsedData.username
                }
            });
    
            res.send(`Usuário com ID ${req.params.id} atualizado!`);
        } catch (error) {
            if(error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao atualizar usuário!', 500));
            }
        }
    }

    async deleteUser(req: Request, res: Response, next : NextFunction) {
        try {
            const id = req.params.id;
            await prisma.user.delete({
                where: { id: id }
            })
            res.send(`Usuário com ID ${req.params.id} deletado!`);

        } catch (error) {
            if(error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao deletar usuário!', 500));
            }
        }
    }
}