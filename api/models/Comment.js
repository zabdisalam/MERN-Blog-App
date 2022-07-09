import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      min: 6,
      unique: true,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
