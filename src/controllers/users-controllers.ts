import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyUserPermission } from '../utils/functions.js';

import bcrypt from 'bcrypt';
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
            max(30, {message: "ERRO: o username deve ter no máximo 30 caracteres!"}),
    password:
        z. 
            string({message: "ERRO: a senha deve ser texto!"}).
            nonempty({message: "ERRO: a senha não pode ser vazia!"}).
            min(6, {message: "ERRO: a senha deve ter no mínimo 6 caracteres!"}).
            max(30, {message: "ERRO: a senha deve ter no máximo 30 caracteres!"})
});

export class UsersController {
    async getUsers(req: Request, res: Response, next : NextFunction) {
        try {

            // VERIFICA SE O USUÁRIO TEM PERMISSÃO

            await verifyUserPermission(req);

            const users = await prisma.user.findMany();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
    
    async createUser(req: Request, res: Response, next : NextFunction) {
        try {

            // VERIFICA SE O USUÁRIO TEM PERMISSÃO

            await verifyUserPermission(req);

            const parsedData = userSchema.parse(req.body);
            const hashedPassword = await bcrypt.hash(parsedData.password, 10);

            const existingUser = await prisma.user.findUnique({ where: { username: parsedData.username } });
            if(existingUser) res.json({message: "ERRO: usuário já existe!"});

            await prisma.user.create({
                data: {
                    name: parsedData.name,
                    username: parsedData.username,
                    password: hashedPassword
                }
            });

            res.json({message: "Usuário criado com sucesso!"});

        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next : NextFunction) {
        try {

            // VERIFICA SE O USUÁRIO TEM PERMISSÃO

            await verifyUserPermission(req);

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
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next : NextFunction) {
        try {

            // VERIFICA SE O USUÁRIO TEM PERMISSÃO

            await verifyUserPermission(req);

            const id = req.params.id;
            await prisma.user.delete({
                where: { id: id }
            })
            res.send(`Usuário com ID ${req.params.id} deletado!`);

        } catch (error) {
            next(error);
        }
    }
}