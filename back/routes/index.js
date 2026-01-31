import express from 'express';


import authRouter from './auth.js';
import homeRouter from './home.js';

const router = express.Router();

router.use('/auth', authRouter)

router.use('/', homeRouter)


export default router