import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.mjs'
import { loggingMiddleware } from './utils/middlewares.mjs';

dotenv.config({ path: '.env' });
const app = express();
//Middleware
app.use(express.json());
app.use('/api',routes);

const PORT = process.env.PORT;


app.get('/', loggingMiddleware, (request, response, next) => {
    console.log('Base URL');
    next();
}, (request, response) => {
    response.status(201).send({ msg: 'Hello World' });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


