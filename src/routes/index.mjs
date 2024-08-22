import { response, Router } from "express";
import userRouter from './users.mjs'
import productsRouter from './products.mjs'
import { loggingMiddleware } from "../utils/middlewares.mjs";
import passport from 'passport'
// We have to import it
import localStrategy from "../strategies/local-strategy.mjs";


const router = Router();

router.use(userRouter);
router.use(productsRouter);

router.get('/', loggingMiddleware, (request, response, next) => {
    console.log('Base URL');
    next();
})
router.post('/auth',
    passport.authenticate("local"),
    (request, respose) => { respose.sendStatus(200) }
)
router.get('/auth/status', (request, response) => {
    console.log(`Inside /auth/status/endpoint`, request.user, request.session);
    return request.user ? response.send(request.user) : response.sendStatus(401);
})

router.post("/auth/logout", (request, response) => {
    if(!request.user) return response.status(401);
    request.logout( (err) => {
        if (err) return response.status(400);
        response.send(200);
    })
})

export default router;

