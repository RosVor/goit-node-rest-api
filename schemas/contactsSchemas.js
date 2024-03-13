import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({ "string.pattern.base": "XXXXX@XXX.com/XXXXX@XXX.net" })
    .required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({ "string.pattern.base": "(XXX) XXX-XXXX" })
    .required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({ "string.pattern.base": "XXXXX@XXX.com/XXXXX@XXX.net" }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({ "string.pattern.base": "(XXX) XXX-XXXX" }),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

  export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});