import {Identifier} from "../utils/identifier.js";
import { Pagination } from "../utils/pagination.js";

export class TodoRepository {
    constructor(todoDB = []) {
        this.todoData = todoDB;
    }

    async createTodo(todo) {
        todo.id = Identifier.generate();

        const timestamp = new Date().toISOString();
        todo.created_at = timestamp;
        todo.updated_at = timestamp;

        this.todoData.push(todo);

        return todo;
    }


  async findByUserId(userID) {
    console.log("Incoming userID", userID);

    this.todoData.forEach(todo => {
      console.log("todos userId ", todo.user_id);
    })

    return this.todoData.find(todo => todo.user_id === userID)
  
  }

  async getAllTodos(queryFilter = {}) {
    let { page, limit, status, search } = queryFilter;
    let queryResults = this.todoData;


    if (status) {
      queryResults = queryResults.filter((todo) => todo.status === status);
    }
    if (search) {
      queryResults = queryResults.filter((todo) =>
        todo.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return new Pagination(page, limit, queryResults, "todos").paginate();
  }

  async updateTodo(id, updatedFields) {
    const todoIndex = this.todoData.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return null;
    }

    this.todoData[todoIndex] = { ...this.todoData[todoIndex], ...updatedFields };

    return this.todoData[todoIndex];
  }

  async deleteTodo(id) {
    const todoIndex = this.todoData.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return null;
    }

    this.todoData.splice(todoIndex, 1);

    return true;
  }
}
