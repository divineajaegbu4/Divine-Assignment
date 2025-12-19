import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let todoList = [];

app.use((req, res, next) => {
  console.log(req.body);
  next()
})

app.get("/", (req, res) => {
  res.send("Todo server is up and running!");
});

app.get("/todo", (req, res) => {
  res.json(todoList);
});

app.post("/todo", (req, res) => {
  const { title, desc } = req.body || {};

  if (!title) {
    return res.status(400)
      .json({ message: "title is a required field!" });
  }

  if (!desc) {
    return res.status(400).json({ message: "desc is a required filed!" });
  }

  const isCompleted = false;
  const currentTime = new Date();
  const id = todoList.length + 1;

  const todo = {
    id,
    title,
    desc,
    isCompleted,
    createdAt: currentTime,
    updateAt: currentTime
  };
  todoList.push(todo);

  res.status(201).json(todo);
})

app.get("/todo/:todoId", (req, res) => {
  let todoId = req.params.todoId;
  if (!todoId || isNaN(Number(todoId))) {
    return res
      .status(400)
      .json({ message: "No id is provided or it's invalid. Please address the issue and try again." });
  }

  todoId = Number(todoId);

  const todo = todoList.find(todo => todo.id === todoId);

  if (!todo) {
    return res
    .status(404)
    .json({message: "There is no resource with the provided ID."})
  }

  res
    .status(200)
    .json(todo);
})

app.put("/todo/:todoId", (req, res) => {
  const todoId = Number(req.params.todoId);

  if(!todoId || isNaN(todoId)) {
   return  res.status(400).json({message: "Invalid number"})
  }

  const findTodoById = todoList.find(todo => todo.id === todoId)
  
  if(!findTodoById) {
    return res.status(404).json({message: "Todo not found!"})
  }

  findById.isCompleted = true;

  res.status(200).json(findById)
  
})

app.delete("/todo/:todoId", (req, res) => {
  const todoId = Number(req.params.todoId);

  if(!todoId) {
    return res.status(400).json({message: "Not a correct id"})
  }

  todoList = todoList.filter(todo => todo.id !== todoId)

  if(!todoList) {
    return res.status(404).json({message: "Todo not found"})
  }

  res.status(200).json(todoList)
})

app.listen(port, () => {
  console.log(`Todo server running at http://localhost:${port}`);
});
