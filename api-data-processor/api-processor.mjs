import axios from "axios"

const getUserTodos = async() => {
    try {
       const [usersRes, todosRes] = await Promise.all([
        await axios.get("https://jsonplaceholder.typicode.com/users"),
        await axios.get("https://jsonplaceholder.typicode.com/todos")
       ])

     const users = usersRes.data;
     const todos = todosRes.data;

       const getUsers = users.map(user => {
           const userTodos =  todos
            .filter(todo =>  user.id === todo.userId && todo.completed)
            .map(todo => todo.title)

            return {
               id: user.id,
               name: user.name,
               username: user.username,
               email: user.email,
               todos: userTodos
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