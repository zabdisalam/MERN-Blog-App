import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Joi from "joi";

export const validateUser = (req, res, next) => {
  let schema = Joi.object().keys({
    username: Joi.string().required().min(6),
    email: Joi.string().required().min(6).email(),
    posts: Joi.array(),
    comments: Joi.array(),
    banner: Joi.string(),
    isAdmin: Joi.boolean(),
  });
  if (res.new_password) {
    schema = schema.keys({
      password: Joi.string().required().min(6).max(15),
    });
  }
  const { error } = schema.validate(req.body);
  if (error) return res.status(406).send(error.details[0].message);
  next();
};

export const hashPass = (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  req.body.password = hash;
  next();
};

export const register = async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      posts: req.body.posts,
      comments: req.body.comments,
      banner: req.body.banner,
      isAdmin: req.body.isAdmin,
    });

    const user = await newUser.save();
    const { isAdmin, password, ...otherDetails } = user._doc;

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.cookie("user_token", token, { httpOnly: true });

    res.status(200).json(otherDetails);
  } catch (err) {
    throw err;
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send(`"username" not found`);

    const isPassCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isPassCorrect)
      return res.status(401).send("username or password is incorrect");

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.cookie("user_token", token, { httpOnly: true });

    res.status(200).json(user._doc);
  } catch (err) {
    throw err;
  }
};
