const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach FULL user including encryptionKey
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
