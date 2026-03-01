import express from "express";
import UsersController from "./users/users.controller.js";

const app = express();
app.use(express.json());
app.use("/users", UsersController)

const port = 2309;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
);

