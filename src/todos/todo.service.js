import {ServerException} from "../exceptions/server.exception.js";
import {BadRequestException} from "../exceptions/badrequest.exception.js";
import {Validator} from "../utils/validator.js";
import {TodoDataValidator} from "./dto/todo.dto.js";
import {NotFoundException} from "../exceptions/notfound.exception.js";

export class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTodo(todoData) {
        const {error} = TodoDataValidator.validateNewTodo(todoData);

        if (error) {
            throw new BadRequestException(Validator.joiValidationErrorToString(error));
        }

        todoData.status = 'pending';

        try {
            return await this.todoRepository.createTodo(todoData);
        } catch (error) {
            throw new ServerException("Failed to create Todo: " + error.message);
        }
    }

    async getAllTodos(queryFilter = {}) {
        if (queryFilter.start_date && queryFilter.end_date) {
            if (queryFilter.start_date > queryFilter.end_date) {
                throw new BadRequestException("Start date must be before end date");
            }
        }

        return await this.todoRepository.getAllTodos(queryFilter);
    }

    async updateTodo(id, updatedFields) {
        const {error} = TodoDataValidator.validateUpdateTodo(updatedFields);

        if (error) {
            throw new BadRequestException(Validator.joiValidationErrorToString(error));
        }

        try {
            return await this.todoRepository.updateTodo(id, updatedFields);
        } catch (error) {
            throw new ServerException("Could not update todo with an id of " + id + ": " + error.message);
        }
    }

    async deleteTodo(id) {
        return this.todoRepository.deleteTodo(id);
    }

    async findById(id) {
        const todo = this.todoRepository.findById(id);

        if (!todo) {
            throw new NotFoundException("Invalid todo ID: " + id + ". Not found in the database.")
        }


    }
}