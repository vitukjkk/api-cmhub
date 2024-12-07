import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsersController {
    async getUsers(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        res.json(users);
    }

    async getUser(req: Request, res: Response) {
        const id = req.params.id;
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        res.json(user);
    }

    async createUser(req: Request, res: Response) {
        const { name, username } = req.body;
        await prisma.user.create({
            data: {
                name: name,
                username: username
            }
        });
        res.send('Usuário criado!');
    }

    async updateUser(req: Request, res: Response) {
        const id = req.params.id;
        const { name, username } = req.body;
        await prisma.user.update({
            where: { id: id },
            data: {
                name: name,
                username: username
            }
        });

        res.send(`Usuário com ID ${req.params.id} atualizado!`);
    }

    async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        await prisma.user.delete({
            where: { id: id }
        })
        res.send(`Usuário com ID ${req.params.id} deletado!`);
    }
}