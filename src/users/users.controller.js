import { Router } from 'express';
import {UserService} from "./users.service.js";
import userDB from '../data/userdb.json' with { type: 'json' };
import contactDB from '../data/contactdb.json' with { type: 'json' };
import addressDB from '../data/addressdb.json' with { type: 'json' };
import {UsersRepository} from "./users.repository.js";
import {ContactsService} from "../contacts/contacts.service.js";
import {ContactsRepository} from "../contacts/contacts.repository.js";
import {AddressRepository} from "../address/address.repository.js";
import {AddressService} from "../address/address.service.js";
import {Password} from "../security/password.js";
import {HttpResponse} from "../http/http.response.js";

const router = Router();

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);

const passwordService = new Password();

const userRepository = new UsersRepository(userDB);
const userService = new UserService(userRepository, contactService, passwordService);

router.post('/', async (req, res) => {
    const newUserData = req.body;

    try {
        const newlyCreatedUser = await userService.createUser(newUserData);

        return res.status(201).json(new HttpResponse(newlyCreatedUser));
    } catch (error) {
        return res.status(error.code).json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/', async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const role = req.query.role || '';
        const status = req.query.status || '';
        const search = req.query.search || '';

        const queryParams = { page, limit, role, status, search };

        const users = await userService.getAllUsers(queryParams);

        return res.status(200).json(new HttpResponse(users));
    } catch (error) {
        return res.status(error.code).json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await userService.findById(id);
        return res.status(200).json(new HttpResponse(user));
    } catch (error) {
        return res.status(error.code).json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});


export default router;