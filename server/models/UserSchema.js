import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: [String],
      enum: ["User"],
      default: ["User"],
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
