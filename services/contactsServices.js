import Contact from "../models/Contact.js";

const listContacts = (filter = {}, query = {}) =>
  
Contact.find(filter, "", query);
const getContactById = (id) => Contact.findById(id);
const addContact = (data) => Contact.create(data);
const updateContactById = (id, data) => 

Contact.findByIdAndUpdate(id, data);
const removeContact = (id) => Contact.findByIdAndDelete(id);
const getOneContactById = (filter) => Contact.findOne(filter);
const updateOneContactById = (filter, data) =>
  
Contact.findOneAndUpdate(filter, data);
const removeOneContact = (filter) => Contact.findOneAndDelete(filter);
export default {
  listContacts,
  addContact,
  getContactById,
  updateContactById,
  removeContact,
  getOneContactById,
  updateOneContactById,
  removeOneContact,
};
