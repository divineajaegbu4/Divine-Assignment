import express from "express";

import logger from "./middleware/logger.mjs";
import ordersRouter from "./routes/orders.mjs";
import productsRouter from "./routes/products.mjs";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API home — working correctly!");
});

app.use(logger);

app.use("/orders", ordersRouter);

app.use("/products", productsRouter);

app.use((err, req, res, next) => {
  console.error(err.message); // Log the full error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred.";
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
