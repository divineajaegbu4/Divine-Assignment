import { Router } from 'express';
import contactDB from '../data/contactdb.json' assert { type: 'json' };
import addressDB from '../data/addressdb.json' assert { type: 'json' };
import {ContactsService} from "./contacts.service.js";
import {ContactsRepository} from "./contacts.repository.js";
import {AddressRepository} from "../address/address.repository.js";
import {AddressService} from "../address/address.service.js";
import {HttpResponse} from "../http/http.response.js";

const router = Router();

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);


router.get('/', async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const queryParams = { page, limit, search };

        const contacts = await contactService.getAllContacts(queryParams);

        return res.status(200).json(new HttpResponse(contacts));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

export default router;