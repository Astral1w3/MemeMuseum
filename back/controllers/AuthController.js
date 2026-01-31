import UserRepository from "../repository/UserRepository.js";
import db from "../config/db.js";
import pgp from "pg-promise"
import bcrypt from 'bcrypt';
import {generateToken} from '../services/jwt.js'

const user = new UserRepository(db, pgp);

export async function register(req, res) {
    const {username, email, password} = req.body;
    const saltRounds = 10;
    const hashedPasword = await bcrypt.hash(password, saltRounds)
    try{
        if(await user.checkIfUserExistByEmail(email)){
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        }else{
            const savedUser = await user.createUser(username, email, hashedPasword);
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

export async function login(req, res) {
    const {username, email, password} = req.body;
    try{
        const foundUser = await user.findByEmail(email);
        if(foundUser){
            if(await bcrypt.compare(password, foundUser.password)){
                const token = generateToken(foundUser);

                res.cookie("jwt", token, {
                    httpOnly: true,    // Protegge da XSS
                    secure: false,     // per HTTPS
                    maxAge: 3600000,   
                    sameSite: 'strict' // Protegge da CSRF il cookie viene inviato solo se la richiesta parte dal tuo stesso sito.
                });

                res.status(200).json({
                    status: "success",
                    message: "login successfull",
                    user:{
                        id: foundUser.id,
                        username: foundUser.username,
                        email: foundUser.email
                    }
                })
            }
            else{
                res.status(401).json({
                    message: "Check if the inserted data are correct"
                })
            }
        }
        else{
            res.status(401).json({
                message: "Check if the inserted data are correct"
            })
        }
    }
    catch{
        console.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }

}

export function logout(req, res){
    res.clearCookie('jwt', {
            httpOnly: true,
            secure: false, // true in prod
            sameSite: 'strict'
        });
    res.status(200).json({ status: "success", message: "Logged out successfully" });
}

