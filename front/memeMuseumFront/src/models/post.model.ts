export interface Post {
    id: number;
    user_id: number;
    username: string; 
    image_path: string; 
    title: string;
    caption?: string;
    tags?: string;
    created_at: string;
    vote_sum: number;       
    user_vote: number | null; // 1 (up), -1 (down), null/0 
}