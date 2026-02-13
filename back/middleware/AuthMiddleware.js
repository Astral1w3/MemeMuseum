import jwt from "jsonwebtoken";

/**
 * @param {boolean} isOptional - se true, non blocca la richiesta se il token manca/e' invalido.
 */
export const authGuard = (isOptional = false) => {
    return (req, res, next) => {
        // recupera il token dai cookie grazie a cookie-parser
        let token = req.cookies.jwt;
        
        if (!token) {
            if (isOptional) {
                req.user = null;
                return next(); // passa come ospite
            } else {
                return res.status(401).json({ status: "failed", message: "Not authenticated" }); // Blocca
            }
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
            // serve perche'cosi' tutti i controller successivi potranno fare `req.user.qualcosa`
            req.user = decoded;
            next();
        } catch (err) {
            // token scaduto o invalido
            if (isOptional) {
                req.user = null; // tratta come ospite
                next();
            } else {
                return res.status(403).json({ status: "failed", message: "Token invalid or expired" });
            }
        }
    };
};