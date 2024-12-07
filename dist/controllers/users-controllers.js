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
const prisma = new PrismaClient();
export class UsersController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma.user.findMany();
            res.json(users);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield prisma.user.findUnique({
                where: { id: id }
            });
            res.json(user);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, username } = req.body;
            yield prisma.user.create({
                data: {
                    name: name,
                    username: username
                }
            });
            res.send('Usuário criado!');
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { name, username } = req.body;
            yield prisma.user.update({
                where: { id: id },
                data: {
                    name: name,
                    username: username
                }
            });
            res.send(`Usuário com ID ${req.params.id} atualizado!`);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield prisma.user.delete({
                where: { id: id }
            });
            res.send(`Usuário com ID ${req.params.id} deletado!`);
        });
    }
}
