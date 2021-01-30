import { Request, Response, Router } from 'express';

const router : Router = Router();

router.post('/register', (req : Request, res : Response) => {
    res.send('This is the registration route');
});

router.post('/login', (req : Request, res : Response) => {
    res.send('This is the login route');
});

router.post('/logout', (req : Request, res : Response) => {
    res.send('This is the logout route');
});

router.post('/authorise', (req : Request, res : Response) => {
    res.send('This is the authorisation route');
});

router.post('/authenticate', (req : Request, res : Response) => {
    res.send('This is the authentication route');
});

router.post('/renewToken', (req : Request, res : Response) => {
    res.send('This is the token renewal route');
});

export default router;
