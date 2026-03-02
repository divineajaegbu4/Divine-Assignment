import { Identifier } from "../utils/identifier.js";

export class TodoService {
  constructor(todoRespository) {
    this.todoRespository = todoRespository;
  }

  async findByPriority(priority) {
    return await this.todoRespository.findByPriority(priority);
  }

  async createTodos(todos) {
    // todos = todos.map((todo) => {
    //   return (todo.id = Identifier.generate());
    // });

    // console.log(todos);

    try {
      return await this.todoRespository.createTodos(todos);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateTodos(id, updateFields) {
    return await this.todoRespository.updateTodos(id, updateFields);
  }

  async getAllTodos() {
    return await this.todoRespository.getAllTodos();
  }

  async deleteTodos(id) {
    return await this.todoRespository.deleteTodos(id);
  }
}
