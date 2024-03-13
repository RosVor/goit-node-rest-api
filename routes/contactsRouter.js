import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteSchema,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import contactsSchemas from "../schemas/contactsSchemas.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

ccontactsRouter.post(
  "/",
  validateBody(contactsSchemas.createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(contactsSchemas.updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(contactsSchemas.updateFavoriteSchema),
  updateFavoriteSchema
);

export default contactsRouter;
