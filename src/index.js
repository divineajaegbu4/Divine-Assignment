import express from "express";
import UsersController from "./users/users.controller.js";
import ContactsController from "./contacts/contacts.controller.js";
import TodoController from "./todos/todo.controller.js";
import dotenv from "dotenv";
import AuthController from "./auth/auth.controller.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/users", UsersController);
app.use("/contacts", ContactsController);
app.use("/todos", TodoController);
app.use("/auth", AuthController);

const port = 2309;
app.listen(port, '0.0.0.0', () =>
  console.log(`Server running at http://localhost:${port}`),
);

