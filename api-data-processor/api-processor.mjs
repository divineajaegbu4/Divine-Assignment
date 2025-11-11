import axios from "axios"



/*
Use modern function called arrow function
async...await
axios
try...catch...finally
Promise.all
map
filter
destructuring
*/

const getUserTodos = async() => {
    try {
      const getPromises = [
         axios.get("https://jsonplaceholder.typicode.com/users"),
         axios.get("https://jsonplaceholder.typicode.com/todos")
       ];

       const [usersRes, todosRes] = await Promise.all(getPromises)

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
    }catch(error) {
       console.log("Error:", error)
    }finally {
      console.log("Finished!");
    }
}

getUserTodos();