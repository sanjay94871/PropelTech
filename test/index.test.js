import request from 'supertest';
import express from 'express';
import  json  from 'body-parser';
import { expect } from 'chai';
import { AddressBook, Contact } from '../AddressBook.js';

const app = express();

app.use(json());

const filePath = 'address_book.json';
const addressBook = new AddressBook(filePath);


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

describe('Address Book API', () => {

    it('should list all contacts', (done) => {
        request(app)
            .get('/contacts')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.be.an('array').that.has.lengthOf(5);
            })
            .end(done);
    });

    it('should add a contact', (done) => {
        request(app)
            .post('/contacts')
            .send({ first_name: 'John', last_name: 'Doe', phone: '1234567890', email: 'john.doe@example.com' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.have.property('message', 'Contact added successfully');
            })
            .end(done);
    });

    it('should update a contact', (done) => {
        request(app)
            .put('/contacts/5')
            .send({ first_name: 'Jane', last_name: 'Doe', phone: '0987654321', email: 'jane.doe@example.com' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.have.property('message', 'Contact updated successfully');
            })
            .end(done);
    });

    it('should search for contacts with email', (done) => {
        request(app)
            .get('/contacts/search?query=jane.doe@example.com')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.be.an('array').that.has.lengthOf(1);
                expect(res.body[0]).to.include({
                    first_name: 'Jane',
                    last_name: 'Doe'
                });
            })
            .end(done);
    });

    it('should search for contacts with name', (done) => {
        request(app)
            .get('/contacts/search?query=Jane')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.be.an('array').that.has.lengthOf(1);
                expect(res.body[0]).to.include({
                    first_name: 'Jane',
                    last_name: 'Doe'
                });
            })
            .end(done);
    });

    it('should delete a contact', (done) => {
        request(app)
            .delete('/contacts/5')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                expect(res.body).to.have.property('message', 'Contact deleted successfully');
            })
            .end(done);
    });

});
