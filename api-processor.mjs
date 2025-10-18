import axios from "axios"

const getUserTodos = async() => {
    try {
       const [users, todos] = await Promise.all([
        await axios.get("https://jsonplaceholder.typicode.com/users").then(res => res.data),
        await axios.get("https://jsonplaceholder.typicode.com/todos").then(res => res.data)
       ])

       const getCompletedTodo = todos.filter(todo => todo.completed = true);
       const getUsers = users.map(user => {
       const getTodosTitle = getCompletedTodo.map(todo => todo.title)
       const getTodosIds = getCompletedTodo.map(todo => console.log("newId:", todo.id))
       if(user.id === getTodosIds) {
            return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            todos: getTodosTitle
          }
       }
    })
       console.log(getUsers)
    }catch(err) {
       console.log("Error:", err)
    }finally {
      console.log("Finished!");
    }
}

getUserTodos();