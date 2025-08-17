import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  userId: String,
  token: String,
});

export default mongoose.model("User", userSchema);
