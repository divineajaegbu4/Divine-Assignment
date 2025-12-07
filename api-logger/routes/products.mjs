import express from "express";

const productsRouter = express.Router();

productsRouter.get("/", (req, res) => {
  res.send("router for products");
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(`router for productsId: ${req.params.id}`);
    // res.status(500).send(err.message);
  } catch (err) {
    next(new Error("Test error!"));
  }
});

export default productsRouter;
