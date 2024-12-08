import express, { Request, Response, NextFunction } from 'express';
import { routes } from './routes/index.js';
import { errorHandler } from './middlewares/my-middleware.js';

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});