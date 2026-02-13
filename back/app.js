import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import indexRouter from './routes/index.js'

import path from 'path'; 
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public'))); //rendo publica la cartella public

app.use(cors({
    origin: 'http://localhost:4200', //accetta richieste solo se provengono da qua
    credentials: true //abilita lo scambio di cookie
}));

app.use(cookieParser());

app.disable("x-powered-by") //header inutile

app.use(express.json());

app.use('/', indexRouter);



export default app;