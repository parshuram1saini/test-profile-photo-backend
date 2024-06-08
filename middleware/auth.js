import jwt from "jsonwebtoken"
const jwt_secret_key = 12345   // Add variable only for testing purpose

export const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ error: "token not found" })

    const token = authorization.split(" ")[1]
    if (!token) return res.status(401).json({ error: "Unauthorized" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || jwt_secret_key)

        req.user = decoded
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Invalid token" })
    }
}

/// ---- function to generate jwt token
export const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET || jwt_secret_key, { expiresIn: 30000 })
}
