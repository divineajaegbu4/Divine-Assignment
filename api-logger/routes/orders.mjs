import express from "express";

const ordersRouter = express.Router();

ordersRouter.get("/", (req, res) => {
    res.send("router to get orders")
} )

ordersRouter.post("/", (req, res) => {
    res.send("router to post orders")
})

export default ordersRouter
