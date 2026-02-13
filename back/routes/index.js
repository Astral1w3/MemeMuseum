import express from 'express';


import authRouter from './auth.js';
import homeRouter from './home.js';
import postRouter from './post.js';

const router = express.Router();
 
router.use('/auth', authRouter)

router.use('/', homeRouter)

router.use('/', postRouter);

export default router