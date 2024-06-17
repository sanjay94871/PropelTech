import express from 'express';
import json from 'body-parser';
import { AddressBook, Contact } from './AddressBook.js';

const app = express();
const addressBook = new AddressBook('address_book.json');

app.use(json());

app.get('/contacts', (req, res) => {
    res.json(addressBook.listContacts());
});

app.post('/contacts', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    const contact = new Contact(first_name, last_name, phone, email);
    addressBook.addContact(contact);
    res.json({ message: 'Contact added successfully' });
});

app.put('/contacts/:id', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    const contact = new Contact(first_name, last_name, phone, email);
    addressBook.editContact(parseInt(req.params.id, 10), contact);
    res.json({ message: 'Contact updated successfully' });
});

app.delete('/contacts/:id', (req, res) => {
    addressBook.deleteContact(parseInt(req.params.id, 10));
    res.json({ message: 'Contact deleted successfully' });
});

app.get('/contacts/search', (req, res) => {
    const query = req.query.query;
    res.json(addressBook.searchContacts(query));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
