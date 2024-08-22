import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose'
import './strategies/local-strategy.mjs'


dotenv.config({ path: '.env' });
const PORT = 3000;


const app = express();
mongoose
    .connect('mongodb://localhost/my_db')
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log(`Error: ${err}`));
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

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

