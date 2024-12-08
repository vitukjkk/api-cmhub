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
    destinatarioId: z.
        string({ message: "ERRO: o destinatário deve ser texto!" }).
        nonempty({ message: "ERRO: o destinatário não pode ser vazio!" }).
        min(3, { message: "ERRO: o destinatário deve ter no mínimo 3 caracteres!" }).
        max(50, { message: "ERRO: o destinatário deve ter no máximo 50 caracteres!" }).
        uuid({ message: "ERRO: o destinatário deve ser um UUID!" })
});
export class MessagesController {
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield prisma.message.findMany();
                res.json(messages);
            }
            catch (error) {
                throw new AppError('Erro ao buscar mensagens!', 500);
            }
        });
    }
    ;
}
;
