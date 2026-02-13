class PostRepository {
    constructor(db, pgp){
        this.db = db;
        this.pgp = pgp;
    }

    async findById(id, currentUserId = null) {
        return this.db.oneOrNone(`
            SELECT 
                p.*, 
                u.username,
                COALESCE(SUM(v.vote), 0)::integer as vote_sum,
                (
                    SELECT vote FROM votes 
                    WHERE post_id = p.id AND user_id = $2
                ) as user_vote
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN votes v ON p.id = v.post_id
            WHERE p.id = $1
            GROUP BY p.id, u.username
        `, [id, currentUserId]);
    }

    async createPost(userId, imagePath, title, tags) {
        return await this.db.one(
            `INSERT INTO posts(user_id, image_path, title, tags) 
            VALUES($1, $2, $3, $4) 
            RETURNING *`,
            [userId, imagePath, title, tags]
        );
    }

    async getAllPosts(page = 1, limit = 10, currentUserId = null) {
        const offset = (page - 1) * limit;

        return this.db.any(`
            SELECT 
                p.id, p.user_id, p.image_path, p.title, p.tags, p.created_at,
                u.username,
                COALESCE(SUM(v.vote), 0)::integer as vote_sum,
                (
                    SELECT vote FROM votes 
                    WHERE post_id = p.id AND user_id = $3
                ) as user_vote
            FROM posts p
            JOIN users u ON p.user_id = u.id 
            LEFT JOIN votes v ON p.id = v.post_id
            GROUP BY p.id, u.username
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset, currentUserId]);
    }
    async getAllPostsDynamic(whereClause, orderByClause, params) {
            const query = `
                SELECT 
                    p.id, p.user_id, p.image_path, p.title, p.tags, p.created_at,
                    u.username,
                    COALESCE(SUM(v.vote), 0)::integer as vote_sum,
                    (
                        SELECT vote FROM votes 
                        WHERE post_id = p.id AND user_id = $(currentUserId)
                    ) as user_vote
                FROM posts p
                JOIN users u ON p.user_id = u.id 
                LEFT JOIN votes v ON p.id = v.post_id
                ${whereClause}
                GROUP BY p.id, u.username
                ORDER BY ${orderByClause}
                LIMIT $(limit) OFFSET $(offset)
            `;

            return this.db.any(query, params);
        }
    
    async vote(userId, postId, value) {
        // se il valore e' 0, rimuoviamo il voto dalla tabella 'votes'
        if (value === 0) {
            return this.db.none(`
                DELETE FROM votes 
                WHERE user_id = $1 AND post_id = $2
            `, [userId, postId]);
        }

        // upsert nella tabella 'votes'
        return this.db.none(`
            INSERT INTO votes (user_id, post_id, vote) 
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, post_id) 
            DO UPDATE SET vote = $3
        `, [userId, postId, value]);
    }

    async getTodaysBest() {
        return this.db.oneOrNone(`
            SELECT 
                p.id, 
                p.title,
                COALESCE(SUM(v.vote), 0)::integer as vote_sum
            FROM posts p
            LEFT JOIN votes v ON p.id = v.post_id
            WHERE p.created_at >= NOW() - INTERVAL '24 HOURS'
            GROUP BY p.id
            ORDER BY vote_sum DESC
            LIMIT 1
        `);
    }
}

export default PostRepository;