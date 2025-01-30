import jwt from 'jsonwebtoken';

const setToken = (payload) => {
    try {
        const token = jwt.sign({ email: payload }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getUser = (token) => {
    try {
        if (!token) return null;
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { setToken, getUser };
