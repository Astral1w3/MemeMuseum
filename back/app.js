import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import indexRouter from './routes/index.js'
const app = express();

app.use(cors());
app.use(cookieParser());
app.disable("x-powered-by") //header inutile
app.use(express.json());


app.use('/', indexRouter);



export default app;