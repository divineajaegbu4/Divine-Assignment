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

      async findById(id) {
    return await this.todoRepository.findById(id);
  }

  async findByUserId(userID) {
    return await this.todoRepository.findByUserId(userID);
  }

  async getAllTodos(queryFilter = {}) {
    try {
      return await this.todoRepository.getAllTodos(queryFilter);
    } catch (error) {
      throw new ServerException("Failed to retrieve todos: " + error.message);
    }
  }

  async updateTodo(id, updatedFields) {
    const { error } = TodoDataValidator.validateUpdateTodo(updatedFields);
    if (error) {
      throw new BadRequestException(
        Validator.joiValidationErrorToString(error),
      );
    }

    const updateTodo = await this.todoRepository.updateTodo(id, updatedFields);

    if (!updateTodo) {
      throw new NotFoundException(`Todo Update failed. Invalid todo id: ${id}`);
    }

    return updateTodo;
  }

  async getUserTodos(userID) {
    try {
      const userTodos = await this.findByUserId(userID);

      console.log(userTodos);

      if (!userTodos || userTodos.length === 0) {
        throw new NotFoundException(
          `User todos not found. Invalid user id: ${userID}`,
        );
      }
      return userTodos;
    } catch (error) {
      throw new ServerException(
        "Failed to retrieve user todos:" + error.message,
      );
    }
  }

  async updateUserTodo(todoID, updatedFields) {
    return await this.updateTodo(todoID, updatedFields);
  }

  async deleteTodo(id) {
    const deleteTodo = await this.todoRepository.deleteTodo(id);

    if (!deleteTodo) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return deleteTodo;
  }
}

