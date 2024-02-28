const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function readContactsFile() {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error("Error while reading contacts file");
    }
}

async function writeContactsFile(contacts) {
    try {
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch (error) {
        throw new Error("Error while writing contacts file");
    }
}

async function listContacts() {
    try {
        return await readContactsFile();
    } catch (error) {
        throw error;
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await readContactsFile();
        const contact = contacts.find(contact => contact.id === contactId);
        if (!contact) {
            throw new Error("Contact not found");
        }
        return contact;
    } catch (error) {
        throw error;
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await readContactsFile();
        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index === -1) {
            throw new Error("Contact not found");
        }
        const removedContact = contacts.splice(index, 1)[0];
        await writeContactsFile(contacts);
        return removedContact;
    } catch (error) {
        throw error;
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await readContactsFile();
        const newContact = { id: Date.now(), name, email, phone };
        const updatedContacts = [...contacts, newContact];
        await writeContactsFile(updatedContacts);
        return newContact;
    } catch (error) {
        throw error;
    }
}

async function updateContact(contactId, updatedFields) {
    try {
        const contacts = await readContactsFile();
        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index === -1) {
            throw new Error("Contact not found");
        }

        contacts[index] = {
            ...contacts[index],
            ...updatedFields
        };

        await writeContactsFile(contacts);
        
        return contacts[index];
    } catch (error) {
        throw error;
    }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
