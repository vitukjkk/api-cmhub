import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

export function errorHandler(err: Error, req: Request, res: Response, _next : NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors, issues: err.format() });
    } else if (err instanceof Error) {
        return res.status(500).json({ message: 'Erro interno no servidor!' });
    }
}

export function authenticateToken(req : Request, res : Response, next : NextFunction) : void {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
        res.status(401).json({ message: 'Token não fornecido!' });
        return;
    }         
    
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if(err) return res.status(403).json({ message: 'Token inválido!' });
        req.body.user = user;
        next();
    });
}