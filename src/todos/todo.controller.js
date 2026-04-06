import { Router } from "express";
import todoDB from "../data/tododb.json" assert { type: "json" };
import userDB from "../data/userdb.json" assert { type: "json" };
import contactDB from "../data/contactdb.json" assert { type: "json" };
import addressDB from "../data/addressdb.json" assert { type: "json" };
import { UserService } from "../users/users.service.js";
import { UsersRepository } from "../users/users.repository.js";
import { ContactsService } from "../contacts/contacts.service.js";
import { ContactsRepository } from "../contacts/contacts.repository.js";
import { AddressRepository } from "../address/address.repository.js";
import { AddressService } from "../address/address.service.js";
import { TodoRepository } from "./todo.repository.js";
import { TodoService } from "./todo.service.js";
import { HttpResponse } from "../http/http.response.js";
import { Password } from "../security/password.js";

const router = Router();

const addressRepository = new AddressRepository(addressDB);
const addressService = new AddressService(addressRepository);

const contactRepository = new ContactsRepository(contactDB);
const contactService = new ContactsService(contactRepository, addressService);

const passwordService = new Password();

const userRepository = new UsersRepository(userDB);
const userService = new UserService(
  userRepository,
  contactService,
  passwordService,
);

const todoRepository = new TodoRepository(todoDB);
const todoService = new TodoService(todoRepository, userService);

router.post("/", async (req, res) => {
  const todoData = req.body;
  // 1. Grab the 'Bearer <token>' string from the headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json(
        new HttpResponse(
          null,
          "data",
          "Error",
          "You must provide your auth_token in the Authorization header!",
        ),
      );
  }

  console.log("authHeader", authHeader);

  // 2. Split the string to get ONLY the token (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  console.log("token", token);

  // 3. Get the middle part of the JWT (the Payload)
  const base64Payload = token.split(".")[1];

  console.log("base64Payload", base64Payload);

  // 4. Convert Base64 back to a readable JSON object
  const decoded = JSON.parse(Buffer.from(base64Payload, "base64").toString());

  console.log("decode", decoded);

  console.log(decoded);
  const userId = decoded.id;
  try {
    const createdTodo = await todoService.createTodo(todoData, userId);
    return res.status(201).json(new HttpResponse(createdTodo));
  } catch (error) {
    return res
      .status(error.code)
      .json(new HttpResponse(null, "data", "Error", error.message));
  }
});

router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const queryParams = { page, limit, search };

    const todos = await todoService.getAllTodos(queryParams);

    return res.status(200).json(new HttpResponse(todos));
  } catch (error) {
    return res
      .status(error.code)
      .json(new HttpResponse(null, "data", "Error", error.message));
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await todoService.deleteTodo(id);
    return res.status(204).send();
  } catch (error) {
    return res
      .status(error.code)
      .json(new HttpResponse(null, "data", "Error", error.message));
  }
});

export default router;
