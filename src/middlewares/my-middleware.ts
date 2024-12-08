import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { ZodError } from 'zod';

export function myMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware executado!');
    next();
}