import { Router } from 'express';
import todoDB from '../data/tododb.json' with { type: 'json' };
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

export default router;