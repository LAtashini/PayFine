import jwt from 'jsonwebtoken';

const authDriver = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.driverId = decoded.id;  
        next();
    } catch (err) {
        console.error("Invalid token:", err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authDriver;
