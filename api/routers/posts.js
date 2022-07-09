import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createPost,
  validatePost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  checkPostId,
} from "../controllers/post.js";
// import { upload } from "../index.js";
// import { uploadFile } from "../s3.js";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

const router = express.Router();

router.post(
  "/",
  verifyToken,
  async (req, res, next) => {
    if (!req.body.photo) next();
    upload.single("image");
    uploadFile(req, res, next);
    await unlinkFile(req.file.path);
    req.body.photo = res.result.Key;
  },
  validatePost,
  createPost
);

router.put(
  "/:id",
  verifyToken,
  checkPostId,
  async (req, res, next) => {
    if (!req.body.title) req.body.title = res.post.title;
    if (!req.body.description) req.body.description = res.post.description;
    if (!req.body.category) req.body.category = res.post.category;
    if (req.body.photo) {
      upload.single("image");
      uploadFile(req, res, next);
      await unlinkFile(req.file.path);
      req.body.photo = res.result.Key;
    }
    validatePost(req, res, next);
  },
  updatePost
);

router.delete("/:id", verifyToken, checkPostId, deletePost);

router.get("/:id", checkPostId, getPost);

router.get("/", getPosts);

export default router;
