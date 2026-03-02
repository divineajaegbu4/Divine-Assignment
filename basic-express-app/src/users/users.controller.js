import { Router } from 'express';
import {UserService} from "./users.service.js";
import userDB from '../data/userdb.json' assert { type: 'json' };
import contactDB from '../data/contactdb.json' assert { type: 'json' };
import addressDB from '../data/addressdb.json' assert { type: 'json' };
import todoDB from '../data/tododb.json' assert {type: 'json'};
import {UsersRepository} from "./users.repository.js";
import {ContactsService} from "../contacts/contacts.service.js";
import {ContactsRepository} from "../contacts/contacts.repository.js";
import {AddressRepository} from "../address/address.repository.js";
import {AddressService} from "../address/address.service.js";
import {Password} from "../security/password.js";
import {HttpResponse} from "../http/http.response.js";
import { TodosRespository } from '../todos/todo.repository.js';
import { TodoService } from '../todos/todo.service.js';

const router = Router();

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);

const todoRespository = new TodosRespository(todoDB);
const todoService = new TodoService(todoRespository)

const passwordService = new Password();

const userRepository = new UsersRepository(userDB);
const userService = new UserService(userRepository, contactService, todoService, passwordService);

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
        const users = await userService.getAllUsers();

        return res.status(200).json(new HttpResponse(users));
    } catch (error) {
        return res.status(error.code).json(new HttpResponse(null, 'data', 'Error', error.message));
    }
})


export default router;