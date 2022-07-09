import express from "express";
import {
  register,
  login,
  hashPass,
  validateUser,
} from "../controllers/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post(
  "/register",
  async (req, res, next) => {
    res.new_password = true;
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(403).send(`"username" already exists`);
    validateUser(req, res, next);
  },
  hashPass,
  register
);
router.post("/login", login);

export default router;
