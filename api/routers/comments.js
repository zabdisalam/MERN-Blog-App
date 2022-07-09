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
// import { upload } from "../index.js";
// import { uploadFile } from "../s3.js";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

const router = express.Router();

router.post(
  "/:postid",
  verifyToken,
  async (req, res, next) => {
    req.params.id = req.params.postid;
    checkPostId(req, res, next);
  },
  async (req, res, next) => {
    if (!req.body.photo) next();
    upload.single("image");
    uploadFile(req, res, next);
    await unlinkFile(req.file.path);
    req.body.photo = res.result.Key;
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
    if (req.body.photo) {
      upload.single("image");
      uploadFile(req, res, next);
      await unlinkFile(req.file.path);
      req.body.photo = res.result.Key;
    }
    validateComment(req, res, next);
  },
  updateComment
);

router.get("/:id", checkCommentId, getComment);

router.get("/", getComments);

export default router;
