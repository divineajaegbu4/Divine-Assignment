import {Identifier} from "../utils/identifier.js";

export class ContactsRepository {
    constructor(contactDB = []) {
        this.contacts = contactDB;
    }

    async findByEmail(email) {
        return await this.contacts.find(contact => contact.email === email);
    }

    async findByPhone(phoneNumber) {
        return await this.contacts.find(contact => contact.phone_number === phoneNumber);
    }

    async createNewContact(contacts) {
        contacts.id = Identifier.generate();

        // Save the new contacts
        this.contacts.push(...contacts);

        return contacts;
    }

    async updateContact(id, updatedFields) {
        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) {
            return null;
        }

        this.contacts[contactIndex] = { ...this.contacts[contactIndex], ...updatedFields };
        return this.contacts[contactIndex];
    }

    async deleteContact(id) {
        const contactIndex = this.contacts.findIndex(contact => contact.id === id);
        if (contactIndex === -1) {
            return false;
        }

        this.contacts.splice(contactIndex, 1);
        return true;
    }
}