import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routers/auth.js";
import usersRoute from "./routers/users.js";
import postsRoute from "./routers/posts.js";
import commentsRoute from "./routers/comments.js";
import imagesRoute from "./routers/images.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

//MongoDB Connect
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

//middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", usersRoute);
app.use("/api/post", postsRoute);
app.use("/api/comment", commentsRoute);
app.use("/api/image", imagesRoute);

//run app
const port = 8000;

app.listen(port, () => {
  connect();
  console.log(`Backend connected to port ${port}`);
});
