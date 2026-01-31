class PostRepository {
    constructor(db, pgp){
        this.db = db;
        this.pgp = pgp;
    }

    async findById(id){
        return this.db.oneOrNone("SELECT * FROM posts where posts.id = ${id}", {id})
    }
}

export default UserRepository