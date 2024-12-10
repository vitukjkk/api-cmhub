import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { routes } from './routes/index.js';
import { errorHandler } from './middlewares/my-middleware.js';

const app = express();

app.use(express.json());
app.use(routes);
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});