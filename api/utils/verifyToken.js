import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.user_token;
    if (!token) return res.status(401).send("Token not found");
    const decoded_user_token = jwt.verify(token, process.env.JWT_SECRET);
    res.decoded_user_token = decoded_user_token;
    next();
  } catch (err) {
    throw res.status(403).send("Invalid Token");
  }
};
