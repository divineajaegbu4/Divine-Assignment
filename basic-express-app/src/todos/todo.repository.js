import { Identifier } from "../utils/identifier.js";

// [{
//     "id": "b1a2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
//     "name": "Learn Node.js",
//     "description": "Learn the basics of Node.js",
//     "due_date": "2023-07-15",
//     "priority": "high",
//     "status": "pending",
//     "user_id": "0df5e8c2-3b6a-4f1e-9f4e-2b8e4c3d5a6f"
// }]
export class TodosRespository {
    constructor(todoDB = []) {
      this.todos = todoDB;
    }

    async findByPriority(priority) {
       return this.todos.find(todo => todo.priority === priority)
    }

    async createTodos(todos) {
        todos.id = Identifier.generate();

        this.todos.push(todos)

        console.log(todos);

        return todos
    }

    async updateTodos(id, updateFields) {
       const index = this.todos.findIndex(todo => todo.id === id)

       if(index === -1) {
          return null
       }

       this.todos[index] = {...this.todos[index], updateFields}

       return this.todos[index]

    }

    async getAllTodos() {
        return this.todos
    }

    async deleteTodos(id) {
        const index = this.todos.findIndex(todo => todo.id === id) 

        if(index === -1) {
            return "Todo not found"
        }

        this.todos.splice(index, 1)

        return true
    }
}