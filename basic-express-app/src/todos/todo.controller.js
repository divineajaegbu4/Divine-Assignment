import { Router } from "express";
import { TodoService } from "./todo.service.js";
import { TodosRepository } from "./todo.repository.js";
import todoDB from "../data/tododb.json" assert { type: "json" };
import { HttpResponse } from "../http/http.response.js";

const todosRepository = new TodosRepository(todoDB);
const todoService = new TodoService(todosRepository);

const router = Router();

router.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const queryParams = { page, limit, search };
  try {
    const todos = await todoService.getAllTodos(queryParams);

    return res.status(200).json(new HttpResponse(todos));
  } catch (error) {
    return res
      .status(error.code)
      .json(new HttpResponse(null, "data", "error", error.message));
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
