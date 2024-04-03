import HttpError from "../helpers/HttpError.js";
import { nanoid } from "nanoid";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {registerUser, findUser, validatePassword, updateUser} from "../services/authSevices.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }
  const avatarURL = gravatar.url(email);

  const verificationCode = nanoid();

  const newUser = await registerUser({
    ...req.body,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: [email],
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationCode}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarUrl: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) throw HttpError(401, "Email not verified");
  const comparePassword = await validatePassword(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await updateUser({ _id: id }, { token });
  res.json({ token });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await findUser({
    verificationCode,
  });

  if (!user) throw HttpError(404, "User not found");

  await updateUser({ _id: user._id }, { verify: true, verificationCode: "" });

  res.json({ message: "Email verification successful" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const resentVerify = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "The email address has already been verified");
  }
  const verifyEmail = {
    to: [email],
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationCode}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Email verification sent" });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: "" });

  res.status(204).json();
};

const changeSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;
  const user = await updateUser({ _id: id }, { subscription });
  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

const changeAvatar = async (req, res) => {
  const { _id: id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar not found");
  }

  const { path: oldPathAvatar, filename } = req.file;
  const newPathAvatar = path.join(avatarPath, filename);

  const image = await Jimp.read(oldPathAvatar);
  await image.cover(250, 250).writeAsync(oldPathAvatar);

  await fs.rename(oldPathAvatar, newPathAvatar);

  const avatarURL = path.join("avatars", filename);
  const user = await updateUser({ _id: id }, { avatarURL });

  res.json({
    avatarURL: user.avatarURL,
  });
};
export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  verify: ctrlWrapper(verify),
  resentVerify: ctrlWrapper(resentVerify),
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
  changeSubscription: ctrlWrapper(changeSubscription),
  changeAvatar: ctrlWrapper(changeAvatar),
};