import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      unique: true,
    },
    featuredImage: {
      type: String,
      unique: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);
const BlogModel = mongoose.model("blogs", BlogSchema);
export default BlogModel;
