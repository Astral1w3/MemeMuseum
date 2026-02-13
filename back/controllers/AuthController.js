import UserRepository from "../repository/UserRepository.js";
import db from "../config/db.js";
import pgp from "pg-promise"
import bcrypt from 'bcrypt';
import {generateToken} from '../services/jwt.js'

const user = new UserRepository(db, pgp);

const isProduction = process.env.NODE_ENV === 'production'; //i need it because i want some feature to be disabled when im testing like sameSite to lax and Secure.

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
            const saltRounds = 10;
            const hashedPasword = await bcrypt.hash(password, saltRounds)

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
    const { email, password } = req.body;

    try {
        const foundUser = await user.findByEmail(email);

        //if the user doesn't exist or the credentaial are wrong we stop everything
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid credentials" 
            });
        }

        const token = generateToken(foundUser);

        res.cookie("jwt", token, {
            httpOnly: true,    
            secure: isProduction,
            maxAge: 3600000,   
            sameSite: isProduction ? 'strict' : 'lax' 
        });

        res.status(200).json({
            status: "success",
            message: "Login successful", 
            user: {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email
            }
        });
    } catch (err) {
        console.error("Login Error:", err); 
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
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax' 
        });
        
    res.status(200).json({ status: "success", message: "Logged out successfully" });
}

