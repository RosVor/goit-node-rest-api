import db from '../db.js';

db.connect();

const mongoose = require('mongoose');
const Contact = require('../schemas/contactsSchemas');

async function listContacts() {
    try {
        return await Contact.find();
    } catch (error) {
        throw error;
    }
}

async function getContactById(contactId) {
    try {
        return await Contact.findById(contactId);
    } catch (error) {
        throw error;
    }
}

async function removeContact(contactId) {
    try {
        return await Contact.findByIdAndDelete(contactId);
    } catch (error) {
        throw error;
    }
}

async function addContact(name, email, phone) {
    try {
        return await Contact.create({ name, email, phone });
    } catch (error) {
        throw error;
    }
}

<<<<<<< Updated upstream
module.exports = { listContacts, getContactById, removeContact, addContact };
=======
async function updateContact(contactId, updatedFields) {
    try {
        return await Contact.findByIdAndUpdate(contactId, updatedFields, { new: true });
    } catch (error) {
        throw error;
    }
}

module.exports = { listContacts, getContactById, removeContact, addContact, updateContact };
>>>>>>> Stashed changes
