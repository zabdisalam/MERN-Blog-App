import Post from "../models/Post.js";
import User from "../models/User.js";
import Joi from "joi";

export const validatePost = (req, res, next) => {
  req.body.user = res.decoded_user_token.username;
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    user: Joi.string().required(),
    photo: Joi.string().required(),
    comments: Joi.array(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(406).send(error.details[0].message);
  next();
};

export const checkPostId = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.post = post;
    next();
  } catch (err) {
    return res.status(500).send("Post does not exist");
  }
};

export const checkUsername = async (req, res, next) => {
  try {
    await User.findOne({ username: req.params.user });
    next();
  } catch (err) {
    console.log(req.params.user);
    return res.status(500).send("Post does not exist");
  }
};

export const createPost = async (req, res, next) => {
  const post = new Post(req.body);
  await post.save();
  await User.findOneAndUpdate(
    { username: post.user },
    {
      $push: { posts: post._id },
    }
  );
  res.status(200).json(post);
};

export const updatePost = async (req, res, next) => {
  if (res.post.user != res.decoded_user_token.username)
    return res.status(401).send("This is not your post");
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json(post);
};

export const deletePost = async (req, res, next) => {
  if (res.post.user != res.decoded_user_token.username)
    return res.status(401).send("This is not your post");
  await Post.findByIdAndDelete(req.params.id);
  await User.findOneAndUpdate(
    { username: res.post.user },
    {
      $pull: { posts: res.post._id },
    }
  );
  res.status(200).send("Post has been deleted");
};

export const getPost = async (req, res, next) => {
  let post;
  await Post.findById(req.params.id)
    .then((res) => {
      post = res;
    })
    .catch((err) => {
      return res.status(404).send("Post not found");
    });
  return res.status(200).json(post);
};

export const getPostsByUsername = async (req, res, next) => {
  let posts;
  await Post.find({ user: req.params.user })
    .then((res) => {
      posts = res;
    })
    .catch((err) => {
      return res.status(404).send(`${req.params.user} has no posts`);
    });
  return res.status(200).json(posts);
};

export const getPosts = async (req, res, next) => {
  const post = await Post.find();
  res.status(200).json(post);
};
