import express from "express";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

import multer from "multer";
const upload = multer({ dest: "uploads/" });

import { uploadFile, getFileStream, deleteFile } from "../controllers/image.js";

const router = express.Router();

router.get("/:key", (req, res, next) => {
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

router.post("/", upload.single("image"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  res.send({ imagePath: `/api/image/${result.Key}` });
});

router.delete("/:key", async (req, res, next) => {
  await deleteFile(req.params.key);
});

export default router;
