import express from "express";
import UsersController from "./users/users.controller.js";
import ContactsController from "./contacts/contacts.controller.js";
import TodoController from "./todos/todo.controller.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'node:url';
import AuthController from "./auth/auth.controller.js";

// 1. Get the full path to the current file
const __filename = fileURLToPath(import.meta.url);

// // 2. Get the directory name from that file path
const __dirname = path.dirname(__filename);
// const envPath = path.resolve(__dirname, '.env.sample');
// console.log("Looking for env at:", envPath);
dotenv.config({path: path.resolve(__dirname, "..", ".env.sample")});

const app = express();
app.use(express.json());
app.use("/users", UsersController);
app.use("/contacts", ContactsController);
app.use("/todos", TodoController);
app.use("/auth", AuthController);

const port = 2309;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
);

