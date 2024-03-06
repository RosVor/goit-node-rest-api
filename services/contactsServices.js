import Contact from "../models/Contact.js";

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
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error while getting contact by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.status(200).json(deletedContact);
    } catch (error) {
        console.error('Error while deleting contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newContact = await Contact.create({ name, email, phone });
        res.status(201).json(newContact);
    } catch (error) {
        console.error('Error while creating contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true });
        if (!updatedContact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Error while updating contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateFavoriteStatus = async (contactId, favorite) => {
    try {
        const existingContact = await Contact.findById(contactId);
        if (!existingContact) {
            return null;
        }

        existingContact.favorite = favorite;
        await existingContact.save();

        return existingContact;
    } catch (error) {
        throw error;
    }
};
