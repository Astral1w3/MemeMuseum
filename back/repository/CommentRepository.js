import db from '../config/db.js'; // Assumo che il path sia questo come negli altri file
import pgp from 'pg-promise';

class CommentRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    async findByPostId(postId) {
        return this.db.any(`
            SELECT 
                c.id, 
                c.body, 
                c.created_at, 
                c.user_id,
                u.username 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at DESC
        `, [postId]);
    }

    async createAndGetUsername(userId, postId, body) {
        return this.db.one(`
            WITH inserted_comment AS (
                INSERT INTO comments (user_id, post_id, body) 
                VALUES ($1, $2, $3) 
                RETURNING *
            )
            SELECT 
                i.*, 
                u.username 
            FROM inserted_comment i
            JOIN users u ON i.user_id = u.id
        `, [userId, postId, body]);
    }
}

export default CommentRepository;