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
const userSchema = z.object({
    name: z.
        string({ message: "ERRO: o nome deve ser texto!" }).
        nonempty({ message: "ERRO: o nome não pode ser vazio!" }).
        min(3, { message: "ERRO: o nome deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o nome deve ter no máximo 50 caracteres!" }),
    username: z.
        string({ message: "ERRO: o username deve ser texto!" }).
        nonempty({ message: "ERRO: o username não pode ser vazio!" }).
        min(3, { message: "ERRO: o username deve ter no mínimo 3 caracteres!" }).
        max(30, { message: "ERRO: o username deve ter no máximo 30 caracteres!" })
});
export class UsersController {
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.user.findMany();
                res.json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield prisma.user.findUnique({
                    where: { id: id }
                });
                if (!user) {
                    throw new AppError('Usuário não encontrado!', 404);
                }
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = userSchema.parse(req.body);
                const newUser = yield prisma.user.create({
                    data: {
                        name: parsedData.name,
                        username: parsedData.username
                    }
                });
                res.status(201).json(newUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const parsedData = userSchema.parse(req.body);
                yield prisma.user.update({
                    where: { id: id },
                    data: {
                        name: parsedData.name,
                        username: parsedData.username
                    }
                });
                res.send(`Usuário com ID ${req.params.id} atualizado!`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield prisma.user.delete({
                    where: { id: id }
                });
                res.send(`Usuário com ID ${req.params.id} deletado!`);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
