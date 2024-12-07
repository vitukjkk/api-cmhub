export class UsersController {
    getUsers(req, res) {
        res.send('Users route');
    }
    getUser(req, res) {
        res.send(`User with id ${req.params.id}`);
    }
    createUser(req, res) {
        res.send('User created');
    }
    updateUser(req, res) {
        res.send(`User with id ${req.params.id} updated`);
    }
    deleteUser(req, res) {
        res.send(`User with id ${req.params.id} deleted`);
    }
}
