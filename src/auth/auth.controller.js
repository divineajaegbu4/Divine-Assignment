import { Router } from 'express';
import userDB from '../data/userdb.json' with { type: 'json' };
import contactDB from '../data/contactdb.json' with { type: 'json' };
import addressDB from '../data/addressdb.json' with { type: 'json' };
import {ContactsService} from "../contacts/contacts.service.js";
import {ContactsRepository} from "../contacts/contacts.repository.js";
import {AddressRepository} from "../address/address.repository.js";
import {AddressService} from "../address/address.service.js";
import {Password} from "../security/password.js";
import {HttpResponse} from "../http/http.response.js";
import {AuthService} from "./auth.service.js";
import {UsersRepository} from "../users/users.repository.js";
import {UserService} from "../users/users.service.js";

const router = Router();

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);

const passwordService = new Password();

const userRepository = new UsersRepository(userDB);
const userService = new UserService(userRepository, contactService, passwordService);

const authService = new AuthService(userService);

router.post("/signup", async (req, res) => {
    const newUserData = req.body;

    try {
        const authUser = await authService.signup(newUserData);
        return res.status(201).json(new HttpResponse(authUser));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.post("/login", async (req, res) => {
    const loginData = req.body;

    try {
        const authUser = await authService.login(loginData);
        return res.status(200).json(new HttpResponse(authUser));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
})


export default router;