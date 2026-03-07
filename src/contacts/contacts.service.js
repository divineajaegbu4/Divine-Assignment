import {Identifier} from "../utils/identifier.js";
import {ServerException} from "../exceptions/server.exception.js";

export class ContactsService {
    constructor(contactRepository, addressService) {
        this.contactRepository = contactRepository;
        this.addressService = addressService;
    }

    async createNewContact(contacts) {
        let contactsWithAddressList = [];
        contacts = contacts.map(contact => {
            contact.id = Identifier.generate();
            // create address.
            // pull out the address object from the contact
            const address = structuredClone(contact.address);
            // delete the address object from the contact object
            delete contact.address;

            this.addressService.createNewAddress(address)
                .then(newAddress => {
                    contact.address_id = newAddress.id;
                    contactsWithAddressList.push({...contact, address: newAddress});
                })
                .catch(error => {
                    throw new ServerException("Address creation error: " + error.message);
                });

            return contact;
        });

        try {
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
}