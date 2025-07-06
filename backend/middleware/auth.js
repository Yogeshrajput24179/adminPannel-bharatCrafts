import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("🔹 Incoming Headers:", req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No valid authorization header received.");
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("❌ Token is missing.");
      return res.status(401).json({ success: false, message: "Token missing." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verification Error:", err.message);

        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }
        if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ success: false, message: "Invalid token. Authentication failed." });
        }

        return res.status(401).json({ success: false, message: "Token verification failed." });
      }

      console.log("✅ Token Decoded Successfully:", decoded);

      if (!decoded.id) {
        console.error("❌ User ID missing in token.");
        return res.status(401).json({ success: false, message: "User ID missing in token." });
      }

      req.user = { id: decoded.id };
      return next();
    });
  } catch (error) {
    console.error("❌ Unexpected Auth Middleware Error:", error.message);
    return res.status(500).json({ success: false, message: "Authentication failed due to a server error." });
  }
};

export default authMiddleware;
