import { Router } from 'express';
import todoDB from '../data/tododb.json' assert { type: 'json' };
import {HttpResponse} from "../http/http.response.js";
import {TodoRepository} from "./todo.repository.js";
import {TodoService} from "./todo.service.js";

const router = Router();

const todoRepository = new TodoRepository(todoDB);
const todoService = new TodoService(todoRepository);

router.post('/', async (req, res) => {
    const newTodo = req.body;

    try {
        const createdTodo = await todoService.createTodo(newTodo);
        return res.status(201).json(new HttpResponse(createdTodo));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
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