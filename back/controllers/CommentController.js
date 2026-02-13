import CommentRepository from '../repository/CommentRepository.js';
import db from '../config/db.js';
import pgp from 'pg-promise';

const commentRepository = new CommentRepository(db, pgp);

export async function getCommentsByPost(req, res) {
    try {
        const { id } = req.params; 

        const comments = await commentRepository.findByPostId(Number(id));

        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ 
            status: "error", 
            message: "Unable to retrieve comments" 
        });
    }
}

export async function addComment(req, res) {
    try {
        const { id } = req.params; 
        const { body } = req.body; // testo del commento
        
        const userId = req.user.id; 

        if (!body || body.trim() === "") {
            return res.status(400).json({ message: "Comment body cannot be empty" });
        }

        const newComment = await commentRepository.createAndGetUsername(userId, Number(id), body);

        res.status(201).json(newComment); 
    } catch (err) {
        console.error("Error posting comment:", err);
        res.status(500).json({ 
            status: "error", 
            message: "Unable to post comment" 
        });
    }
}