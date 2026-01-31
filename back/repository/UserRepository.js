class UserRepository {
    constructor(db, pgp){
        this.db = db;
        this.pgp = pgp;
    }

    async findById(id){
        return this.db.oneOrNone("SELECT * FROM users where users.id = ${id}", {id})
    }
    async findByEmail(email){
        return this.db.oneOrNone("SELECT * FROM users where users.email = ${email}", {email})
    }
    async createUser(username, email, password){
        const query = "INSERT INTO users(username, email, password) VALUES(${username}, ${email}, ${password}) RETURNING id, username, email";
        return this.db.one(query, {username, email, password});
    }
    async checkIfUserExistByEmail(email){
        const user = await this.db.oneOrNone("SELECT 1 FROM users WHERE users.email = ${email}", {email});
        return !!user;
    }
}

export default UserRepository