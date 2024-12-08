export function myMiddleware(req, res, next) {
    console.log('Middleware executado!');
    next();
}
