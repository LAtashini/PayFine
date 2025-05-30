import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access forbidden: Admins only." });
        }

        req.admin = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

export default authAdmin;
