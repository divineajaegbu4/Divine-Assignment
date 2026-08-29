import { Identifier } from "../utils/identifier.js";
import { Pagination } from "../utils/pagination.js";

export class TodosRepository {
  constructor(todosDB = []) {
    this.todos = todosDB;
  }

  async createTodos(todos) {
    // todos.id = Identifier.generate();
    todos.map(todo => todo.id = Identifier.generate())

    this.todos.push(...todos);

    return todos;
  }

  async findById(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  async findByUserId(userID) {
    console.log("Incoming userID", userID);

    this.todos.forEach(todo => {
      console.log("todos userId ", todo.user_id);
    })

    return this.todos.find(todo => todo.user_id === userID)

  
    // return this.todos.find(todo => todo.user_id === userID)
  }

  async getAllTodos(queryFilter = {}) {
    let { page, limit, status, search } = queryFilter;
    let queryResults = this.todos;


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
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return null;
    }

    this.todos[todoIndex] = { ...this.todos[todoIndex], ...updatedFields };

    return this.todos[todoIndex];
  }

  async deleteTodo(id) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return null;
    }

    this.todos.splice(todoIndex, 1);

    return true;
  }
}
