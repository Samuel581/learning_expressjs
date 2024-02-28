import express, { request } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.mjs'
import { loggingMiddleware } from './utils/middlewares.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
dotenv.config({ path: '.env' });
const app = express();
//Middlewares
//Middleware for parser JSON
app.use(express.json());
//Middlaware for sessions
app.use(
    session(
        {
            //Here goes something more complicated, but this is for test purposes only
            secret: 'Samuel the dev',
            //To not have empty sessions stored
            saveUninitialized: false,
            //
            resave: false,
            cookie: {
                //A cookie that will last 15 mins
                maxAge: 60000 * 15
            }
        }
    ));
//Middlaware for parser cookies
app.use(cookieParser())
app.use('/api', routes);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', loggingMiddleware, (request, response, next) => {
    console.log('Base URL');
    next();
}, (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    //With whis line we can keep track of the user and doesn't restarts at each HTTP request
    request.session.visited = true;
    response.cookie('hello', 'world', { maxAge: 60000 * 60 });
    response.status(201).send({ msg: 'Hello World' });
})

app.post('/api/auth', (request, response) => {
    const { body: { username, password } } = request;
    const findUser = mockUsers.find(
        user => user.username === username
    )
    if (!findUser || findUser.password !== password) return response.status(401).send({ msg: "BAD CREDENTIALS" });

    request.session.user = findUser;
    return response.status(200).send(findUser);
})

app.get('/api/auth/status', (request, response) => {
    return request.session.user
        ? response.status(200).send(request.session.user)
        : response.status(401).send({ msg: "Not Authenticated" });
})

app.post('/api/cart', (request, response) => {
    if (!request.session.user) return response.sendStatus(401);
    const { body: item } = request;

    const {cart} = request.session;
    if(cart){
        cart.push(item)
    } else {
        request.session.cart = [item];
    }

    return responnse.status(201).send(item);
})

app.get('/api/cart', (request, response) =>{
    if(!request.session.cart) return response.sendStatus(401);
    return response.send(request.session.cart ?? []);
})
