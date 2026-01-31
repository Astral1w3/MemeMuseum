import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.SECRET_ACCESS_TOKEN,
        { expiresIn: '1h' }
    );
};
