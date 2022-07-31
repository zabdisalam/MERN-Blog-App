import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Joi from "joi";

export const validateComment = (req, res, next) => {
  req.body.user = res.decoded_user_token.username;
  if (!req.body.post) req.body.post = req.params.postid;
  const schema = Joi.object({
    text: Joi.string().required(),
    post: Joi.string().required(),
    user: Joi.string().required(),
    photo: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(406).send(error.details[0].message);
  next();
};

export const checkCommentId = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(500).send("Comment does not exist");
  res.comment = comment;
  next();
};

export const checkPostId = async (req, res, next) => {
  const post = await Post.findById(req.params.postid);
  if (!post) return res.status(500).send("Post does not exist");
  res.post = post;
  next();
};

export const getPostComments = async (req, res, next) => {
  let comments;
  try {
    await Comment.find({ post: res.post._id }).then((res) => {
      comments = res;
    });
  } catch (err) {
    res.status(404).send("Post does not exist");
  }
  return res.status(200).json(comments);
};

export const createComment = async (req, res, next) => {
  const comment = new Comment(req.body);
  const savedComment = await comment.save();
  await User.findOneAndUpdate(
    { username: comment.user },
    {
      $push: { comments: savedComment._id },
    }
  );
  await Post.findByIdAndUpdate(req.params.postid, {
    $push: { comments: savedComment._id },
  });
  res.status(200).json(comment);
};

export const updateComment = async (req, res, next) => {
  if (
    res.comment.user != res.decoded_user_token.username &&
    !res.decoded_user_token.isAdmin
  )
    return res.status(401).send("This is not your comment");
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json(updatedComment);
};

export const deleteComment = async (req, res, next) => {
  if (
    res.comment.user != res.decoded_user_token.username &&
    !res.decoded_user_token.isAdmin
  )
    return res.status(401).send("This is not your post");
  await Comment.findByIdAndDelete(res.comment.id);
  await User.findOneAndUpdate(
    { username: res.comment.user },
    {
      $pull: { comments: res.comment._id },
    }
  );
  await Post.findByIdAndUpdate(res.comment.post, {
    $pull: { comments: res.comment._id },
  });
  res.status(200).send("Post has been deleted");
};

export const getComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  res.status(200).json(comment);
};

export const getCommentsByUsername = async (req, res, next) => {
  let comments;
  await Comment.find({ user: req.params.user })
    .then((res) => {
      comments = res;
    })
    .catch((err) => {
      return res.status(404).send(`${req.params.user} has no posts`);
    });
  return res.status(200).json(comments);
};

export const getComments = async (req, res, next) => {
  const comment = await Comment.find();
  res.status(200).json(comment);
};
