import {Schema, model} from "mongoose";
import hooks from "./hooks.js";
import {emailRegex} from "../constants/userConstants.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegex,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", hooks.handleSaveError);
userSchema.pre("findOneAndUpdate", hooks.setUpdateSettings);
userSchema.post("findOneAndUpdate", hooks.handleSaveError);

const User = model("user", userSchema);

export default User;