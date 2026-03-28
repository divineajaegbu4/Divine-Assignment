import {Identifier} from "../utils/identifier.js";
import {ServerException} from "../exceptions/server.exception.js";
import {NotFoundException} from "../exceptions/notfound.exception.js";
import {BadRequestException} from "../exceptions/badrequest.exception.js";
import {Validator} from "../utils/validator.js";
import {ContactDataValidator} from "./dto/contact.dto.js";

export class ContactsService {
    constructor(contactRepository, addressService) {
        this.contactRepository = contactRepository;
        this.addressService = addressService;
    }

    async createNewContact(contacts) {
        let contactsWithAddressList = [];
        const contactPromise = contacts.map(async (contact) => {
            contact.id = Identifier.generate();
            // create address.
            // pull out the address object from the contact
            const address = structuredClone(contact.address);
            // delete the address object from the contact object
            delete contact.address;

            const newAddress = await this.addressService.createNewAddress(address);
            contact.address_id = newAddress.id;
            contactsWithAddressList.push({...contact, address: newAddress});

            return await contact;
        });

        try {
            contacts = await Promise.all(contactPromise);
            await this.contactRepository.createNewContact(contacts);

            return contactsWithAddressList;
        } catch (error) {
            contacts.forEach(contact => {
                this.addressService.delete(contact.address_id);
            });

            throw new ServerException("Failed to create contact: " + error.message);
        }
    }

    async findByPhone(phoneNumber) {
        return this.contactRepository.findByPhone(phoneNumber);
    }

    async findByEmail(email) {
        return this.contactRepository.findByEmail(email);
    }

    async findByUserId(userID) {
        let userContacts = await this.contactRepository.findByUserId(userID);

        userContacts = userContacts.map(async (contact) => {
            contact = structuredClone(contact);

            contact.address = await this.addressService.findById(contact.address_id);
            delete contact.address_id;

            return await contact;
        });

        return await Promise.all(userContacts);
    }

    async findById(id) {
        const contact = await this.contactRepository.findById(id);
        if (!contact) {
            throw new NotFoundException("Contact not found. Invalid contact id: " + id);
        }

        return contact;
    }

    async getAllContacts(queryFilter = {}) {
        try {
            const contactResponse = await this.contactRepository.getAllContacts(queryFilter);
            const contacts = contactResponse.contacts.map(async (contact) => {
                contact = structuredClone(contact);
                contact.address = await this.addressService.findById(contact.address_id);
                delete contact.address_id;
                return contact;
            });

            contactResponse.contacts = await Promise.all(contacts);

            return await contactResponse;
        } catch (error) {
            throw new ServerException("Failed to retrieve contacts: " + error.message);
        }
    }

    async updateContact(id, updatedFields) {
        const {error} = ContactDataValidator.validateUpdateContact(updatedFields);

        if (error) {
            throw new BadRequestException(Validator.joiValidationErrorToString(error));
        }

        let contactRecord = null;
        try {
            contactRecord = await this.findById(id);
        } catch (error) {
            throw new ServerException("Failed to retrieve contact: " + error.message);
        }

        const address = structuredClone(updatedFields.address);
        // delete the address object from the contact object
        delete updatedFields.address;

        const updatedAddress = await this.addressService.updateAddress(contactRecord.address_id, address);


        try {
            let updatedContact = await this.contactRepository.updateContact(id, updatedFields);
            if (!updatedContact) {
                throw new NotFoundException("Contact not found. Invalid contact id: " + id);
            }

            updatedContact = structuredClone(updatedContact);
            delete updatedContact.address_id;
            updatedContact.address = updatedAddress;

            return updatedContact;
        } catch (error) {
            throw new ServerException("Failed to update contact: " + error.message);
        }

    }
}