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

router.get('/', async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const status = req.query.status || '';
        const search = req.query.search || '';
        const priority = req.query.priority || '';
        const title = req.query.title || '';
        let due_date = req.query.due_date || '';
        let start_date = req.query.start_date || '';
        let end_date = req.query.end_date || '';

        if (due_date.length > 0) {
            due_date = new Date(due_date);
        }
        if (start_date.length > 0) {
            start_date = new Date(start_date);
        }
        if (end_date.length > 0) {
            end_date = new Date(end_date);
        }

        const queryParams = {
            page, limit, priority,
            title, due_date, status,
            search, start_date, end_date
        }

        const users = await todoService.getAllTodos(queryParams);

        return res.status(200).json(new HttpResponse(users));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.get('/:id', async (req, res) => {
    const { id }= req.params;

    try {
        const todo = await todoService.findById(id);

        return res.status(200).json(new HttpResponse(todo));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body: updateData} = req;
    try {
        const updatedTodo = await todoService.updateTodo(id, updateData);
        return res.status(200).json(new HttpResponse(updatedTodo));
    } catch (error) {
        return res
            .status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await todoService.deleteTodo(id);
        return res.status(204).send();
    } catch (error) {
        return res.
            status(error.code)
            .json(new HttpResponse(null, 'data', 'Error', error.message));
    }
})

export default router;