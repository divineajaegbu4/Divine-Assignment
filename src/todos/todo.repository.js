import {Identifier} from "../utils/identifier.js";

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
}
