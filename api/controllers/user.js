import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";

export const updateUser = async (req, res, next) => {
  try {
    const prevUser = await User.findById(res.decoded_user_token.id);
    const updatedUser = await User.findByIdAndUpdate(
      res.decoded_user_token.id,
      { $set: req.body },
      { new: true }
    );
    await Post.updateMany(
      { user: prevUser.username },
      { user: updatedUser.username }
    );
    await Comment.updateMany(
      { user: prevUser.username },
      { user: updatedUser.username }
    );
    const token = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        isAdmin: updatedUser.isAdmin,
      },
      process.env.JWT_SECRET
    );
    const { isAdmin, password, ...otherDetails } = updatedUser._doc;
    res.cookie("user_token", token, { httpOnly: true });
    return res.status(200).json(otherDetails);
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (req, res, next) => {
  let user;
  await User.findById(req.params.id)
    .then((res) => {
      const { password, isAdmin, ...otherDetails } = res._doc;
      user = { ...otherDetails };
    })
    .catch((err) => {
      return res.status(404).send("User not found");
    });
  return res.status(200).json(user);
};

export const getUserByUsername = async (req, res, next) => {
  let user;
  await User.findOne({ username: req.params.user })
    .then((res) => {
      const { password, isAdmin, ...otherDetails } = res._doc;
      user = { ...otherDetails };
    })
    .catch((err) => {
      return res.status(404).send("User not found");
    });
  return res.status(200).json(user);
};

export const getUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) return res.status(404).send("There are no users in the database");
  res.status(200).json(users);
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(res.decoded_user_token.id);
  if (!user)
    return res
      .status(404)
      .send("Unable to delete user. Make sure you're logged in");
  res.status(200).send("User has been deleted");
};
