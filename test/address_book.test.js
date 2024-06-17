import { expect } from 'chai';
import { AddressBook, Contact } from '../AddressBook.js';
import { existsSync, unlinkSync } from 'fs';

describe('AddressBook', () => {
    const testFilePath = 'address_book.json';
    let addressBook = new AddressBook(testFilePath);

    it('should add a contact', () => {
        const contact = new Contact('Test', 'User', '1234567890', 'test@example.com');
        addressBook.addContact(contact);
        const contacts = addressBook.listContacts();
        expect(contacts).to.have.lengthOf(6);
        expect(contacts[5].first_name).to.equal('Test');
    });

    it('should edit a contact', () => {
        const newContact = new Contact('Updated', 'User', '0987654321', 'updated@example.com');
        addressBook.editContact(5, newContact);
        const contacts = addressBook.listContacts();
        expect(contacts[5].first_name).to.equal('Updated');
    });

    it('should delete a contact', () => {
        addressBook.deleteContact(0);
        const contacts = addressBook.listContacts();
        expect(contacts).to.have.lengthOf(5);
    });
});
