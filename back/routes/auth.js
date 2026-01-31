import express from 'express';
import db from '../config/db.js'
import pgp from 'pg-promise'
import { check } from "express-validator"
import { register, login, logout } from '../controllers/AuthController.js'
import Validate from '../middleware/Validate.js'
import UserRepository from '../repository/UserRepository.js'
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

const user = new UserRepository(db, pgp);

router.post('/login', 
    check("email").isEmail().normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    login 
);

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

router.post('/logout', logout)

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user //verifytoken rende accessibile req.user
    });
});


export default router;