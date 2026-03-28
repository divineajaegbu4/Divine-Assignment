import {Identifier} from "../utils/identifier.js";
import {Pagination} from "../utils/pagination.js";

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

    async findById(id) {
        return this.contacts.find(contact => contact.id === id) || null;
    }

    async findByUserId(userID) {
        return this.contacts.find(contact => contact.user_id === userID);
    }

    async getAllContacts(queryFilter = {}) {
        let {page, limit, search} = queryFilter;
        let queryResults = this.contacts;

        if (search) {
            queryResults = queryResults.filter(
                contact =>
                    contact.phone_number.toLowerCase().includes(search.toLowerCase()) ||
                    contact.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        return new Pagination(page, limit, queryResults, 'contacts').paginate()
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