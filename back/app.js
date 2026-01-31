import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import indexRouter from './routes/index.js'
const app = express();

app.use(cors({
    origin: 'http://localhost:4200', //accetta richieste solo se provengono da qua
    credentials: true //abilita lo scambio di cookie
}));
app.use(cookieParser());
app.disable("x-powered-by") //header inutile
app.use(express.json());


app.use('/', indexRouter);



export default app;