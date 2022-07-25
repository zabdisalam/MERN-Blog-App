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
} from "../controllers/comment.js";
const router = express.Router();

router.post(
  "/:postid",
  verifyToken,
  async (req, res, next) => {
    req.params.id = req.params.postid;
    checkPostId(req, res, next);
  },
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
    validateComment(req, res, next);
  },
  updateComment
);

router.get("/:id", checkCommentId, getComment);

router.get("/", getComments);

export default router;
