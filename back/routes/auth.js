import express from 'express';
import db from '../config/db.js'
import pgp from 'pg-promise'
import { check } from "express-validator"
import { register } from '../controllers/auth.js'
import Validate from '../middleware/validate.js'
import UserRepository from '../repository/UserRepository.js'

const router = express.Router();

const user = new UserRepository(db, pgp);

router.get('/login', async (req, res)=>{
    const result = await user.findById(1);
    res.send(result);
})

//express-validator middlewares
router.post( "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address") //if isEmail fails set the message
        .normalizeEmail(), //if it doesn't fail then sanitize it
    check("username")
        .not().isEmpty()
        .withMessage("You username is required")
        .trim() //remove blankspaces
        .escape(), //translate &,/eccc to html friendly
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    Validate,
    register //UserRepository function
);




export default router;