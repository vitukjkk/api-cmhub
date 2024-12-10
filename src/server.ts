import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { routes } from './routes/index.js';
import { errorHandler } from './middlewares/my-middleware.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World from Vitor!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});