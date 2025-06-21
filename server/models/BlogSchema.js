import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    featuredImage: {
      type: String,
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
