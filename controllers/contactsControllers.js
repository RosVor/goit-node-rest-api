import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import * as contactSchemas from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        throw new HttpError(500, "Internal Server Error");
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);
        if (!contact) {
            throw new HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        throw new HttpError(500, "Internal Server Error");
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await contactsService.removeContact(id);
        if (!deletedContact) {
            throw new HttpError(404, "Not found");
        }
        res.status(200).json(deletedContact);
    } catch (error) {
        throw new HttpError(500, "Internal Server Error");
    }
};

export const createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        validateBody(contactSchemas.createContactSchema)(req, res, async () => {
            const newContact = await contactsService.addContact(name, email, phone);
            res.status(201).json(newContact);
        });
    } catch (error) {
        throw new HttpError(500, "Internal Server Error");
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        validateBody(contactSchemas.updateContactSchema)(req, res, async () => {
            const updatedContact = await contactsService.updateContact(id, { name, email, phone });
            if (!updatedContact) {
                throw new HttpError(404, "Not found");
            }
            res.status(200).json(updatedContact);
        });
    } catch (error) {
        throw new HttpError(500, "Internal Server Error");
    }
};

export const updateFavoriteStatus = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { favorite } = req.body;

        const validationResult = contactSchemas.updateFavoriteSchema.validate({ favorite });
        if (validationResult.error) {
            throw new HttpError(400, validationResult.error.message);
        }

        const updatedContact = await contactsService.updateFavoriteStatus(contactId, favorite);

        if (!updatedContact) {
            res.status(404).json({ message: "Not found" });
        } else {
            res.status(200).json(updatedContact);
        }
    } catch (error) {
        console.error("Error updating favorite status:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
};