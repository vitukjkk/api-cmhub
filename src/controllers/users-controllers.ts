import express, { Request, Response } from 'express';

export class UsersController {
    getUsers(req: Request, res: Response) {
        res.send('Users route');
    }

    getUser(req: Request, res: Response) {
        res.send(`User with id ${req.params.id}`);
    }

    createUser(req: Request, res: Response) {
        res.send('User created');
    }

    updateUser(req: Request, res: Response) {
        res.send(`User with id ${req.params.id} updated`);
    }

    deleteUser(req: Request, res: Response) {
        res.send(`User with id ${req.params.id} deleted`);
    }
}