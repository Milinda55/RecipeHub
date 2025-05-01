const jwt = require("jsonwebtoken")
const verifyToken = async(req,res,next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Authorization token required"});
        }


        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({message: "Invalid or expired token"})
            }
            req.user = decoded;
            next();
        })
    } catch (error) {
        return res.status(500).json({message: "Authentication failed"});
    }
}

module.exports=verifyToken