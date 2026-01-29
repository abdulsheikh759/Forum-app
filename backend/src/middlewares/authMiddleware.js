import jwt from "jsonwebtoken";

const authProtect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized", success:false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
    
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success:false });
  }
};

export default authProtect;
