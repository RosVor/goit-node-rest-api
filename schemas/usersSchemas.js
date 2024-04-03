import Joi from "joi";
import {emailRegex} from "../constants/userConstants.js";
export const userRegisterSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .messages({ "string.pattern.base": `Incorrect e-mail format` }),
  password: Joi.string().min(6).required(),
});
export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});
export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
export const userEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .message("Must be a valid email")
    .required(),
});