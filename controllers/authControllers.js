import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import {registerUser, findUser, validatePassword, updateUser,} from "../services/authServices.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }
  const avatarURL = gravatar.url(email);
  const newUser = await registerUser({ ...req.body, avatarURL });

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

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
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
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
  changeSubscription: ctrlWrapper(changeSubscription),
  changeAvatar: ctrlWrapper(changeAvatar),
};