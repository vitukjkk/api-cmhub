var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError } from './app-error.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export function verifyUserPermission(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // VERIFICAR SE O USUÁRIO TEM PERMISSÃO
        const user = req.body.user;
        const userHasPermission = yield prisma.user.findUnique({
            where: {
                id: user.id
            }
        });
        if ((userHasPermission === null || userHasPermission === void 0 ? void 0 : userHasPermission.role) !== 'admin') {
            throw new AppError("ERRO: usuário não tem permissão!", 403);
        }
    });
}
