import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = (req, res) => {
    const contacts = contactsService.listContacts();
    res.status(200).json(contacts);
};

export const getOneContact = (req, res) => {
    const { id } = req.params;
    const contact = contactsService.getContactById(id);
    if (!contact) {
        throw new HttpError(404, "Not found");
    }
    res.status(200).json(contact);
};

export const deleteContact = (req, res) => {
    const { id } = req.params;
    const deletedContact = contactsService.removeContact(id);
    if (!deletedContact) {
        throw new HttpError(404, "Not found");
    }
    res.status(200).json(deletedContact);
};

export const createContact = (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        throw new HttpError(400, "Body must have all fields");
    }
    const newContact = contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
};

export const updateContact = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
        throw new HttpError(400, "Body must have at least one field");
    }
    const updatedContact = contactsService.updateContact(id, { name, email, phone });
    if (!updatedContact) {
        throw new HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
};
