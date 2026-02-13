import PostRepository from '../repository/PostRepository.js';
import db from '../config/db.js';
import pgp from 'pg-promise';
import { Result } from 'express-validator';

const postRepository = new PostRepository(db, pgp);

export async function createPost(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file" });
        }

        console.log("Saved to:", req.file.path);

        const userId = req.user.id; //token
        const imagePath = `/public/uploads/${req.file.filename}`; //image_path è il percorso web relativo

        const title = req.body.title || ""; // Se vuoto salva stringa vuota

        let tags = [];
        if (req.body.tags) {
            try {
                // trasformiamo la stringa "['a','b']" in un array ['a','b']
                // pg-promise poi lo trasformerà in '{a,b}' per il database.
                tags = JSON.parse(req.body.tags);
            } catch (e) {
                console.error("Errore parsing tags:", e);
                tags = []; 
            }
        }
        const newPost = await postRepository.createPost(userId, imagePath, title, tags);

        res.status(200).json({
            status: "success",
            message: "Meme loaded",
            post: newPost
        });

    } catch (err) {
        console.error("Error during the post creation:", err);
        res.status(500).json({ 
            status: "error",
            message: "Error during the post creation" 
        });
    }
}

/**
 * Helper: Gestione Filtro Tags
 * Aggiorna l'array whereConditions e l'oggetto params per pg-promise
 */
function applyTagFilters(tagsParam, whereConditions, params) {
    if (!tagsParam) return;

    // "gatto,cane" -> ['gatto', 'cane']
    const tagsArray = tagsParam.split(',');

    tagsArray.forEach((tag, index) => {
        const cleanTag = tag.trim();
        if (cleanTag) {
            const paramName = `tag${index}`;
            
            whereConditions.push(`p.tags::text ILIKE $(${paramName})`);
            
            params[paramName] = `%${cleanTag}%`;
        }
    });
}

/**
 * Helper: Gestione Filtro Temporale
 * Aggiorna l'array whereConditions in base al periodo scelto
 */
function applyTimeFilters(timeFrame, whereConditions) {
    if (!timeFrame || timeFrame === 'all') return;

    const timeMap = {
        'today': "INTERVAL '24 HOURS'",
        'week': "INTERVAL '7 DAYS'",
        'month': "INTERVAL '30 DAYS'"
    };

    if (timeMap[timeFrame]) {
        whereConditions.push(`p.created_at >= NOW() - ${timeMap[timeFrame]}`);
    }
}

/**
 * Helper: Costruzione Clausola Ordinamento
 * Restituisce la stringa ORDER BY completa
 */
function buildOrderByClause(sortBy, order) {
    const safeOrder = (order === 'ASC') ? 'ASC' : 'DESC';

    if (sortBy === 'score') {
        return `vote_sum ${safeOrder}`;
    }
    
    return `p.created_at ${safeOrder}`;
}


export async function getAllPosts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const currentUserId = req.user ? req.user.id : null;
        const offset = (page - 1) * limit;

        const params = { limit, offset, currentUserId };
        let whereConditions = ["1=1"];

        applyTagFilters(req.query.tags, whereConditions, params);
        applyTimeFilters(req.query.time, whereConditions);

        const whereClause = "WHERE " + whereConditions.join(" AND ");
        const orderByClause = buildOrderByClause(req.query.sort, req.query.order);

        const posts = await postRepository.getAllPostsDynamic(whereClause, orderByClause, params);
        
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: posts
        });

    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ 
            status: "error",
            message: "Error fetching posts" 
        });
    }
}

export async function getPostById(req, res) {
    try {

        const { id } = req.params; 
        const currentUserId = req.user ? req.user.id : null;

        const post = await postRepository.findById(Number(id), currentUserId);

        res.status(200).json({
            status: "success",
            data: post
        });
    }
    catch(err) {
        console.error("Error", err);
        res.status(500).json({ 
            status: "error",
            message: "Errore interno al server" 
        });
    }
}

export async function votePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // dal token
        const { value } = req.body; // 1, -1, o 0

        if (![1, -1, 0].includes(value)) {
            return res.status(400).json({ message: "Invalid vote value" });
        }

        await postRepository.vote(userId, Number(postId), value);

        res.status(200).json({ status: "success" });
    } catch (err) {
        console.error("Vote error:", err);
        res.status(500).json({ message: "Error voting" });
    }
}

export async function getTodaysBest(req, res) {
    try {
        const bestPost = await postRepository.getTodaysBest();

        if (!bestPost) {
            return res.status(404).json({ 
                status: "fail", 
                message: "No posts found today" 
            });
        }

        res.status(200).json({
            status: "success",
            data: bestPost
        });

    } catch (err) {
        console.error("Error fetching best post:", err);
        res.status(500).json({ 
            status: "error", 
            message: "Server error" 
        });
    }
}