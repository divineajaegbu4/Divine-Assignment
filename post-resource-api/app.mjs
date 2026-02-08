import express from "express";
import { customizedError } from "./error-handling/middleware-error.mjs";
import { router } from "./routes/postRoutes.mjs";

const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome to the server" });
});

app.use("/post-resource-api", router);

app.use(customizedError);

app.listen(port, () => {
  console.log(`Running Server: http://${hostname}:${port}`);
});
