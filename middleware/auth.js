import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED TOKEN", decoded)
            req.user = await User.findById(decoded.id).select('-password');
            console.log("USER FOUND:", req.user ? "YES" : "NO");
            next();
        } catch (err) {
            console.error('Auth error:', err);
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token, not authorized' });
    }
};

export default protect;
