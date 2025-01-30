import { getUser } from '../util/authToken.js';

const userAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ success: false, error: 'Unauthorized! Token Missing.' });
        }
        const token = authHeader.split(' ')[1];
        const payload = getUser(token);
        if (!payload) {
            return res.status(401).json({ success: false, error: 'Unauthorized! Invalid Token.' });
        }
        req.user = payload.email;
        next();
    } catch (error) {
        console.error(`User Authentication Error: ${error.message}`);
        return res.status(401).json({ success: false, error: 'Unauthorized! Authentication Failed.' });
    }
}

export default userAuth;
