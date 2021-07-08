import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: { type: String },
  socialLogin: { type: Boolean, default: false },
  avatarUrl: { type: String },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

userSchema.pre("save", async function () {
  try {
    if (this.isModified("password")) {
      this.password = await bcryptjs.hash(this.password, 5);
    }
  } catch (e) {
    console.log(e);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
