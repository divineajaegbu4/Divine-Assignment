import express from "express";
import UsersController from "./users/users.controller.js";
import ContactsController from "./contacts/contacts.controller.js";
import TodosController from "./todos/todo.controller.js"

const app = express();
app.use(express.json());
app.use("/users", UsersController);
app.use("/contacts", ContactsController);
app.use("/todos", TodosController)

const port = 2309;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
);

