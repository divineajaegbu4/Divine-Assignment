import {ServerException} from "../exceptions/server.exception.js";
import {BadRequestException} from "../exceptions/badrequest.exception.js";
import {Validator} from "../utils/validator.js";
import {TodoDataValidator} from "./dto/todo.dto.js";

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
}