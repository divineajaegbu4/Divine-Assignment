
import {NotFoundException} from "../exceptions/notfound.exception.js";
import { ServerException } from "../exceptions/server.exception.js";
import { Validator } from "../utils/validator.js";
import { TodoDataValidator } from "./dto/todo.dto.js";

export class TodoService {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async createTodos(todo) {
    return await this.todoRepository.createTodos(todo);
  }

  async findById(id) {
    return await this.todoRepository.findById(id);
  }

  async findByUserId(userID) {
    return await this.todoRepository.findByUserId(userID);

    // console.log("userTodos:", userTodos);

    // return await Promise.all(userTodos);

    // return await this.todoRepository.findByUserId(userID)

    // return userTodos;
  }

  async getAllTodos(queryFilter = {}) {
    try {
      return await this.todoRepository.getAllTodos(queryFilter);
    } catch (error) {
      throw new ServerException("Failed to retrieve todos: " + error.message);
    }
  }


  async updateTodo(id, updatedFields) {
    const { error } = TodoDataValidator.validateTodo(updatedFields);
    if (error) {
      throw new BadRequestExceptio(
        Validator.joiValidationErrorToString(error),
      );
    }

    const updateTodo = await this.todoRepository.updateTodo(id, updatedFields);

    if (!updateTodo) {
      throw new NotFoundException(`Todo Update failed. Invalid todo id: ${id}`);
    }

    return updateTodo;
  }

  async deleteTodo(id) {
    const deleteTodo = await this.todoRepository.deleteTodo(id);

    if (!deleteTodo) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return deleteTodo;
  }
}
