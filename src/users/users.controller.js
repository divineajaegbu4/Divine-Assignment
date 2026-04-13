import { Router } from 'express';
import {UserService} from "./users.service.js";
import userDB from '../data/userdb.json' assert { type: 'json' };
import contactDB from '../data/contactdb.json' assert { type: 'json' };
import addressDB from '../data/addressdb.json' assert { type: 'json' };
import {UsersRepository} from "./users.repository.js";
import {ContactsService} from "../contacts/contacts.service.js";
import {ContactsRepository} from "../contacts/contacts.repository.js";
import {AddressRepository} from "../address/address.repository.js";
import {AddressService} from "../address/address.service.js";
import {Password} from "../security/password.js";
import {HttpResponse} from "../http/http.response.js";
import TokenDecoder from "../middlewares/token.decoder.middleware.js";
import {role} from "../middlewares/role.middleware.js";

const router = Router();
router.use(TokenDecoder());

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);

const passwordService = new Password();

const userRepository = new UsersRepository(userDB);
const userService = new UserService(userRepository, contactService, passwordService);

router.get('/', role(["admin"]), async (req, res) => {
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
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/me', role(["admin", "user"]), async (req, res) => {
    const { id } = req.principal;
    try {
        const user = await userService.findById(id);
        return res.status(200).json(new HttpResponse(user));
    } catch (error) {
        return res
            .status(error.code)
    }
});

router.get('/:id', role(["admin"]), async (req, res) => {
    const { id }= req.params;

    try {
        const user = await userService.findById(id);
        return res.status(200).json(new HttpResponse(user));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.put("/me", role(["admin", "user"]), async (req, res) => {
    const { id } = req.principal;
    const { body: updateData} = req;

    try {
        const updatedUser = await userService.updateUser(id, updateData);
        return res.status(200).json(new HttpResponse(updatedUser));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.put('/:id', role(["admin"]), async (req, res) => {
    const { id } = req.params;
    const { body: updateData} = req;

    try {
        const updatedUser = await userService.updateUser(id, updateData);
        return res.status(200).json(new HttpResponse(updatedUser));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.delete('/:id', role(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        await userService.deleteUser(id);
        return res.status(204).send();
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/me/contacts', role(["admin", "user"]), async (req, res) => {
    const { id } = req.principal;
    try {
        const userContacts = await userService.getUserContacts(id);
        return res.status(200).json(new HttpResponse(userContacts));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/:userID/contacts', role(["admin"]), async (req, res) => {
    const {userID} = req.params;
    try {
        const userContacts = await userService.getUserContacts(userID);
        return res.status(200).json(new HttpResponse(userContacts));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.put('/me/contacts/:contactID', role(["admin", "user"]), async (req, res) => {
    const {contactID} = req.params;
    const updatedFields = req.body;

    try {
        const updatedContact = await userService.updateUserContact(contactID, updatedFields);
        return res.status(200).json(new HttpResponse(updatedContact));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.put('/:userID/contacts/:contactID', role(["admin"]), async (req, res) => {
    const {userID, contactID} = req.params;
    const updatedFields = req.body;

    try {
        const updatedContact = await userService.updateUserContact(contactID, updatedFields);
        return res.status(200).json(new HttpResponse(updatedContact));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});


export default router;