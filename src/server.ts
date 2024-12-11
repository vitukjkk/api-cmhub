import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { routes } from './routes/index.js';

const app = express();

app.use(cors({origin: '*'}));

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World from Vitor!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});