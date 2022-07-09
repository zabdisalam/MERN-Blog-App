import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      res.decoded_user_token.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    throw err;
  }
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(res.decoded_user_token.id);
  if (!user) return res.status(404).send("User not logged in");
  const { password, isAdmin, ...otherDetails } = user._doc;
  res.status(200).json({ ...otherDetails });
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
