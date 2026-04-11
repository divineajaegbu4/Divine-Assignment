import {Identifier} from "../utils/identifier.js";
import {Pagination} from "../utils/pagination.js";

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

    async findById(id) {
        return this.todoData.find(todo => todo.id === id) || null;
    }

    async findByUserId(userID) {
        return this.getAllTodos({ user_id: userID});
    }

    async getAllTodos(queryFilter = {}) {
        let {
            user_id,
            page, limit, priority,
            title, due_date, status,
            search, start_date, end_date,
        } = queryFilter;

        let queryResults = this.todoData;

        if (user_id) {
            queryResults = queryResults.filter(todo => todo.user_id === user_id);
        }

        if (priority) {
            queryResults = queryResults.filter(todo => todo.priority.toLowerCase() === priority.toLowerCase());
        }
        if (title) {
            queryResults = queryResults.filter(todo => todo.title.toLowerCase() === title.toLowerCase());
        }
        if (status) {
            queryResults = queryResults.filter(todo => todo.status === status);
        }
        if (search) {
            queryResults = queryResults.filter(
                todo =>
                    todo.priority.toLowerCase().includes(search.toLowerCase()) ||
                    todo.title.toLowerCase().includes(search.toLowerCase()) ||
                    todo.status.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (due_date) {
            queryResults = queryResults.filter(todo => todo.due_date.toDateString() === due_date.toDateString());
        }

        if (start_date && end_date) {
            queryResults = queryResults.filter(todo => todo.updated_at >= start_date && todo.updated_at <= end_date);
        }

        return new Pagination(page, limit, queryResults, 'todos').paginate()
    }

    async updateTodo(id, updatedFields) {
        const todoIndex = this.todoData.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            return null;
        }

        // Update the updatedAt timestamp
        updatedFields.updated_at = new Date().toISOString();

        this.todoData[todoIndex] = {...this.todoData[todoIndex], ...updatedFields};
        return this.todoData[todoIndex];
    }

    async deleteTodo(id) {
        const todoIndex = this.todoData.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            return false;
        }

        this.todoData.splice(todoIndex, 1);
        return true;
    }
}
