import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/app-error.js';
import z from 'zod';
import { authenticateToken } from '../middlewares/my-middleware.js';

const prisma = new PrismaClient();

const postSchema = z.object({
    title:
        z.
            string({message: "ERRO: o título deve ser texto!"}).
            nonempty({message: "ERRO: o título não pode ser vazio!"}).
            min(3, {message: "ERRO: o título deve ter no mínimo 3 caracteres!"}).
            max(50, {message: "ERRO: o título deve ter no máximo 50 caracteres!"}),
    content:
        z.
            string({message: "ERRO: o conteúdo deve ser texto!"}).
            nonempty({message: "ERRO: o conteúdo não pode ser vazio!"}).
            min(3, {message: "ERRO: o conteúdo deve ter no mínimo 3 caracteres!"}).
            max(500, {message: "ERRO: o conteúdo deve ter no máximo 500 caracteres!"}),
    authorUserName:
        z.
            string({message: "ERRO: o autor deve ser texto!"}).
            nonempty({message: "ERRO: o autor não pode ser vazio!"}).
            min(3, {message: "ERRO: o autor deve ter no mínimo 3 caracteres!"}).
            max(30, {message: "ERRO: o autor deve ter no máximo 50 caracteres!"}),
});

export class PostsController {
    async getPosts(req : Request, res : Response) {
        try {
            const posts = await prisma.post.findMany();
            res.json(posts);
        } catch(error) {
            throw new AppError('Erro ao buscar posts!', 500);
        }
    }

    async getPost(req : Request, res : Response, next : NextFunction) {
        try {
            const username = req.params.username;

            const post = await prisma.post.findMany({
                where: { author: { username: username } }
            })

            res.json(post);
        } catch(error) {
            next(error);
        }
    }

    async createPost(req : Request, res : Response, next : NextFunction) {
        try {
            const parsedData = postSchema.parse(req.body);
            
            console.log(parsedData);

            const newPost = await prisma.post.create({
                data: {
                    title: parsedData.title,
                    content: parsedData.content,
                    username: parsedData.authorUserName,
                    authorId: 'ola mundo'
            }});

            res.json(newPost);

        } catch(error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao criar post!', 500));
            }
        }
    }

    async updatePost(req : Request, res : Response, next : NextFunction) {
        try {
            const id = req.params.id;
            const parsedData = postSchema.parse(req.body);

            const updatedPost = await prisma.post.update({
                where: { id: id },
                data: {
                    title: parsedData.title,
                    content: parsedData.content,
                }
            });

            res.json(updatedPost);
        } catch(error) {
            if (error instanceof z.ZodError) {
                next(new AppError(error.errors[0].message, 400));
            } else {
                next(new AppError('Erro ao atualizar post!', 500));
            }
        }
    }

    async deletePost(req : Request, res : Response, next : NextFunction) {
        try {
            const id = req.params.id;

            await prisma.post.delete({
                where: { id: id }
            });

            res.send(`Post com ID ${req.params.id} deletado!`);
        } catch(error) {
            next(new AppError('Erro ao deletar post!', 500));
        }
    }
}