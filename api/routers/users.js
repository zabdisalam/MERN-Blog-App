import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../utils/verifyToken.js";
import { hashPass, validateUser } from "../controllers/auth.js";
import {
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} from "../controllers/user.js";
// import { upload } from "../index.js";
// import { uploadFile } from "../s3.js";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

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
    if (req.body.photo) {
      upload.single("image");
      uploadFile(req, res, next);
      await unlinkFile(req.file.path);
      req.body.photo = res.result.Key;
    }
    validateUser(req, res, next);
  },
  (req, res, next) => {
    if (req.body.password) hashPass(req, res, next);
    else next();
  },
  updateUser
);

router.get("/", verifyToken, getUser);

router.get("/all", verifyToken, (req, res, next) => {
  if (!res.decoded_user_token.isAdmin)
    return res.status(401).send("You are not authorized to get all users");
  getUsers(req, res, next);
});

router.delete("/", verifyToken, deleteUser);

export default router;
