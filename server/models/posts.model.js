import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    code: {
      type: String,
    },
    createdAt: String,
    imageUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
