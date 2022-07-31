import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getComments,
  validateComment,
  checkCommentId,
  checkPostId,
  getPostComments,
  getCommentsByUsername,
} from "../controllers/comment.js";
import { checkUsername } from "../controllers/post.js";
const router = express.Router();

router.post(
  "/:postid",
  verifyToken,
  checkPostId,
  validateComment,
  createComment
);

router.delete("/:id", checkCommentId, verifyToken, deleteComment);

router.put(
  "/:id",
  checkCommentId,
  verifyToken,
  async (req, res, next) => {
    if (!req.body.text) req.body.text = res.comment.text;
    req.body.post = res.comment.post;
    validateComment(req, res, next);
  },
  updateComment
);

router.get("/:id", checkCommentId, getComment);

router.get("/post/:postid", checkPostId, getPostComments);

router.get("/username/:user", checkUsername, getCommentsByUsername);

router.get("/", getComments);

export default router;
