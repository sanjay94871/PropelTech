import fs from 'fs';

class Contact {
    constructor(firstName, lastName, phone, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
    }

    toJSON() {
        return {
            first_name: this.firstName,
            last_name: this.lastName,
            phone: this.phone,
            email: this.email
        };
    }
}

class AddressBook {
    constructor(filePath) {
        this.filePath = filePath;
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    }

    readContacts() {
        const data = fs.readFileSync(this.filePath);
        return JSON.parse(data);
    }

    writeContacts(contacts) {
        fs.writeFileSync(this.filePath, JSON.stringify(contacts, null, 4));
    }

    addContact(contact) {
        const contacts = this.readContacts();
        contacts.push(contact.toJSON());
        this.writeContacts(contacts);
    }

    editContact(index, newContact) {
        const contacts = this.readContacts();
        if (index >= 0 && index < contacts.length) {
            contacts[index] = newContact.toJSON();
            this.writeContacts(contacts);
        }
    }

    deleteContact(index) {
        const contacts = this.readContacts();
        if (index >= 0 && index < contacts.length) {
            contacts.splice(index, 1);
            this.writeContacts(contacts);
        }
    }

    listContacts() {
        return this.readContacts();
    }

    searchContacts(query) {
        const contacts = this.readContacts();
        return contacts.filter(contact => 
            contact.first_name.toLowerCase().includes(query.toLowerCase()) ||
            contact.last_name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email.toLowerCase().includes(query.toLowerCase())
        );
    }
}

export { AddressBook, Contact };