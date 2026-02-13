import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        errors.array().forEach(err => {
             extractedErrors[err.param] = err.msg; 
        });
        return res.status(422).json({ errors: extractedErrors });
    }
    next();
};

export default Validate;