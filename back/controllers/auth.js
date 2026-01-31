import UserRepository from "../repository/UserRepository.js";
import db from "../config/db.js";
import pgp from "pg-promise"

const user = new UserRepository(db, pgp);

export async function register(req, res) {
    const {username, email, password} = req.body;
    try{
        if(await user.checkIfUserExistByEmail(email)){
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        }else{
            const savedUser = await user.createUser(username, email, password);
            res.status(200).json({
                status: "success",
                data: [savedUser],
                message:
                    "Thank you for registering with us. Your account has been successfully created.",
            });
        }
    }catch(err){
        console.error(err);
         res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
