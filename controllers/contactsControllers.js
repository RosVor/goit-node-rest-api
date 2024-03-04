import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
<<<<<<< Updated upstream
import validateBody from "../helpers/validateBody.js"; 
=======
import validateBody from "../helpers/validateBody.js";
import * as contactSchemas from "../schemas/contactsSchemas.js";
import db from '../db.js';
>>>>>>> Stashed changes

db.connect();
export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
        throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) {
        throw new HttpError(404, "Not found");
    }
    res.status(200).json(deletedContact);
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    });

    validateBody(schema)(req, res, async () => {
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact);
    });
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string()
    });
    validateBody(schema)(req, res, async () => {
        const updatedContact = await contactsService.updateContact(id, { name, email, phone });
        if (!updatedContact) {
            throw new HttpError(404, "Not found");
        }
        res.status(200).json(updatedContact);
    });
};
