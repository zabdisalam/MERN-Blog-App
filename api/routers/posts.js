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
  checkUsername,
  getPostsByUsername,
} from "../controllers/post.js";

const router = express.Router();

router.post("/", verifyToken, validatePost, createPost);

router.put(
  "/:id",
  verifyToken,
  checkPostId,
  async (req, res, next) => {
    if (!req.body.title) req.body.title = res.post.title;
    if (!req.body.description) req.body.description = res.post.description;
    if (!req.body.category) req.body.category = res.post.category;
    validatePost(req, res, next);
  },
  updatePost
);

router.delete("/:id", verifyToken, checkPostId, deletePost);

router.get("/:id", checkPostId, getPost);

router.get("/username/:user", checkUsername, getPostsByUsername);

router.get("/", getPosts);

export default router;
