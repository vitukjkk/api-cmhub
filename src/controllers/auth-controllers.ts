import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/app-error.js";
import jwt from 'jsonwebtoken';
import z from 'zod';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userSchema = z.object({
    name: z.
        string({message: "O nome deve ser um texto!"}).
        min(3, {message: "O nome deve ter no mínimo 3 caracteres!"}).
        max(50, {message: "O nome deve ter no máximo 50 caracteres!"}),
    username: z.
        string({message: "O username deve ser um texto!"}).
        min(3, {message: "O username deve ter no mínimo 3 caracteres!"}).
        max(30, {message: "O username deve ter no máximo 30 caracteres!"}),
    password: z.
        string({message: "A senha deve ser um texto!"}).
        min(6, {message: "A senha deve ter no mínimo 6 caracteres!"}).
        max(30, {message: "A senha deve ter no máximo 30 caracteres!"})
});

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try { // TRY CATCH PARA CAPTAR ERROS
            
            // PRIMEIRO, VALIDAR OS DADOS RECEBIDOS 
            const { name, username, password } = req.body;
            userSchema.parse({ name, username, password });
            
            // ENCRIPTAR SENHA
            const hashedPassword = await bcrypt.hash(password, 10);

            // CRIAR USUARIO NO SCHEMA
            const user = await prisma.user.create({
                data: {
                    name,
                    username,
                    password: hashedPassword
                }
            });

            res.json({ message: "Usuário criado com sucesso!", user });
        } catch(error) {
            next(error);
        }
    };
    
    async login(req: Request, res: Response, next: NextFunction) {
      try {

        // VALIDAR DADOS RECEBIDOS
        const { username, password } = req.body;
        
        // BUSCAR USUARIO NO BANCO DE DADOS
        const user = await prisma.user.findUnique({
          where: {
            username
          }
        });
        
        // SE NÃO EXISTIR USUARIO, RETORNAR ERRO
        if (!user) {
          throw new AppError("Usuário não encontrado!", 404);
        }

        // COMPARAR SENHAS

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new AppError("Senha incorreta!", 401);
        }

        // SETAR TOKEN

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: "1h"
        });

        // RETORNAR USUARIO
        res.json({ message: "Usuário logado com sucesso!", user, token });

      } catch(error) {
        next(error);
      }
    };
}