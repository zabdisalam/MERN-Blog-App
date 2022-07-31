import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../utils/verifyToken.js";
import { hashPass, validateUser } from "../controllers/auth.js";
import {
  updateUser,
  getUserByUsername,
  getUsers,
  deleteUser,
  getUserById,
} from "../controllers/user.js";

const router = express.Router();
router.put(
  "/",
  verifyToken,
  async (req, res, next) => {
    res.new_password = true;
    const originalUser = await User.findById(res.decoded_user_token.id);
    if (!req.body.username) req.body.username = originalUser.username;
    else {
      const updatedUsername = await User.findOne({
        username: req.body.username,
      });
      if (updatedUsername && updatedUsername.username != originalUser.username)
        return res.status(403).send("username already exists");
    }
    if (!req.body.email) req.body.email = originalUser.email;
    if (!req.body.password) res.new_password = false;
    validateUser(req, res, next);
  },
  (req, res, next) => {
    if (req.body.password) hashPass(req, res, next);
    else next();
  },
  updateUser
);

router.get("/:id", getUserById);

router.get("/username/:user", getUserByUsername);

router.get("/all", verifyToken, (req, res, next) => {
  if (!res.decoded_user_token.isAdmin)
    return res.status(401).send("You are not authorized to get all users");
  getUsers(req, res, next);
});

router.delete("/", verifyToken, deleteUser);

export default router;
