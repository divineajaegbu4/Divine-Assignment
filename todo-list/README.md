# 📝 To-Do List Manager

A simple command-line mini application built with JavaScript that helps you manage a to-do list using **arrays, objects, functions, and loops**.
This project demonstrates how to build and simulate a small interactive program — a key step toward creating real-world applications.

## 🎯 Objective

To practice JavaScript fundamentals by building a basic To-Do List Manager that allows users to:

- View all tasks

- Add new tasks

- Mark tasks as complete

- (Bonus) Delete tasks

## ⚙️ Setup Instructions

1. Create a file named:

```bash 
todo.js
```

2. Inside this file, define an array of task objects:

```javascript
const todoList = [
  { id: 1, task: 'Buy groceries', completed: false },
  { id: 2, task: 'Finish Week 4 assignment', completed: true }
];
let nextId = 3;
```

🧠 Core Functions

1️⃣ displayTasks()

- Takes no arguments.

- Loops through the todoList array.

- Prints each task with a checkbox showing whether it’s completed.
Example:

```css
[x] Finish Week 4 assignment
[ ] Buy groceries
```

2️⃣ addTask(taskText)

- Takes a string (task description).

- Creates a new task object with:
    - A unique id

    - task =  the given text

    - completed = false
- Adds it to the todoList array.

- Increments nextId.

3️⃣ markTaskComplete(taskId)

- Takes a task’s numeric ID.

- Finds the task with that ID and changes completed to true.

💻 Simulation Example

At the bottom of your file, simulate using your functions:

```javascript
console.log("--- Initial To-Do List ---");
displayTasks();

console.log("\n--- Adding New Tasks ---");
addTask("Clean the kitchen");
addTask("Read a chapter of a book");
displayTasks();

console.log("\n--- Completing a Task ---");
markTaskComplete(1); // Marks 'Buy groceries' as complete
displayTasks();
```


🏆 Bonus Challenge

Add a new function:

deleteTask(taskId)

Removes a task by its ID using array methods such as:

- findIndex() to locate the task

- splice() to remove it

Example:

```javascript
deleteTask(2);
```

📤 Submission
- Submit your completed todo.js file via a Pull Request to your personal assignments repository.

- Follow the professional branching workflow learned in Week 4.

[Back To Home](../README.md)