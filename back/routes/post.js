import express from 'express';
import { uploadMulter } from '../middleware/MulterConfig.js'; 
import { authGuard } from '../middleware/AuthMiddleware.js'; 
import { addComment, getCommentsByPost } from '../controllers/CommentController.js';
import { createPost, getAllPosts, getPostById, votePost, getTodaysBest } from '../controllers/PostController.js';
const router = express.Router();


// upload.single('memeImg'): Poi cerca un UNICO file nel campo 'memeImg'
router.post('/upload', 
    authGuard(false), //prima controlla se sei loggato (middleware 1)
    uploadMulter.single('meme'), 
    //single permette di prendere solo un immagine che si chiama "meme"
    //multer controlla se il file rispetta i requisiti che abbiamo settato nel setup e lo salva. 
    //crea l'oggetto req.file
    createPost
);

router.get('/posts', authGuard(true), getAllPosts);
router.get('/posts/todays-best', authGuard(true), getTodaysBest);
router.get('/posts/:id', authGuard(true), getPostById);
router.get('/posts/:id/comments', getCommentsByPost);

// serve essere loggati
router.post('/posts/:id/comments', authGuard(false), addComment);
// serve essere loggati
router.post('/posts/:id/vote', authGuard(false), votePost);


export default router;