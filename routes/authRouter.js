import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {userRegisterSchema, userLoginSchema, subscriptionSchema} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  authControllers.register
);
authRouter.post("/login", validateBody(userLoginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logOut);

authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  authControllers.changeSubscription
);
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authControllers.changeAvatar
);

export default authRouter;