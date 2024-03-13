import Contact from "../models/Contact.js";
import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error while getting all contacts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error while getting contact by ID:', error);
        res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.status(200).json(deletedContact);
    } catch (error) {
        console.error('Error while deleting contact:', error);
        res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    validateBody(contactSchema)(req, res, async () => {
        try {
            const newContact = await Contact.create({ name, email, phone });
            res.status(201).json(newContact);
        } catch (error) {
            console.error('Error while creating contact:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true });
        if (!updatedContact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error while updating contact:', error);
        res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};

export const updateContactFavorite = async (req, res) => {
    const { contactId } = req.params;
    const { favorite } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
        if (!updatedContact) {
            throw new HttpError(404, 'Contact not found');
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error while updating contact favorite status:', error);
        res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};
