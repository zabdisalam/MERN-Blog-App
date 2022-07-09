import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      requried: true,
    },
    user: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
