import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema({
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
    enum: ["Admin"],
    default: ["Admin"],
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});
const AdminModel = mongoose.model("admins", AdminSchema);
export default AdminModel;
