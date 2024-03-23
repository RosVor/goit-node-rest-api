import Joi from "joi";
import { phoneRegex, emailRegex } from "../constants/userConstants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email(emailRegex)
    .messages({ "string.pattern.base": `Incorrect e-mail format` })
    .required(),
  phone: Joi.string()
    .pattern(phoneRegex)
    .messages({ "string.pattern.base": `Incorrect phone format` })
    .required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string()
    .email(emailRegex)
    .messages({ "string.pattern.base": `Incorrect e-mail format` }),
  phone: Joi.string()
    .pattern(phoneRegex)
    .messages({ "string.pattern.base": `Incorrect phone format` }),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});