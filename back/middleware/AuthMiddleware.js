import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // recupera il token dai cookie grazie a cookie-parser
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "Not authenticated",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        
        // serve perche' tutti i controller successivi potranno fare `req.user.id`
        req.user = decoded; 
        
        next();
    } catch (err) {
        return res.status(403).json({
            status: "failed",
            message: "Token non valido o scaduto.",
        });
    }
};