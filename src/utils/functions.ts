import { Request } from 'express';
import { AppError } from './app-error.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyUserPermission(req : Request) {   
    // VERIFICAR SE O USUÁRIO TEM PERMISSÃO
    const user = req.body.user;

    const userHasPermission = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if(userHasPermission?.role !== 'admin') {
        throw new AppError("ERRO: usuário não tem permissão!", 403);
    }
}