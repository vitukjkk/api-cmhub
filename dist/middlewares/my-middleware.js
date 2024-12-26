import { AppError } from '../utils/app-error.js';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
export function errorHandler(err, req, res, _next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    else if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors, issues: err.format() });
    }
    else if (err instanceof Error) {
        return res.status(500).json({ message: 'Erro interno no servidor!' });
    }
}
export function authenticateToken(req, res, next) {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token não fornecido!' });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token inválido!' });
        console.log('token válido!');
        next();
    });
}
