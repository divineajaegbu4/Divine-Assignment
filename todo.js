const todoList = [
{ id: 1, task: 'Buy groceries', completed: false },
{ id: 2, task: 'Finish Week 4 assignment', completed: true }
];

let nextId = 3;

const displayTasks = () => {
    let status;

    for(let i = 0; i < todoList.length; i++) {
        
        const task = todoList[i];
        

        switch(task.completed) {
            case true:
                status = `[x] ${task.task}`;
                break;
            default:
                status = `[ ] ${task.task}`;
        }

        console.log(status)
    }

}


const addTask = (taskText) => {

    const newTask = {
        id: nextId++, // add the old value then increment
        task: taskText,
        completed: false
    }
 
    todoList.push(newTask);
 
    console.log(todoList)
}

const markTaskComplete = (taskId) => {
    for(let i = 0; i < todoList.length; i++) {
        const task = todoList[i];

        if(task.id === taskId) {
            task.completed = true;
        }

         console.log(task);
}
 }

 const deleteTask = (taskId) => {
    for (let i = todoList.length - 1; i > 0;  i--) {
      const task = todoList[i];

      if(task.id === taskId) {
         todoList.splice(i, 1);

         console.log(`${task.id} deleted!`)
      }
    }

    console.log(todoList);
 }



 console.log("--- Initial To-Do List ---");

 displayTasks();

console.log("\n--- Adding New Tasks ---");
addTask("Clean the kitchen");
addTask("Read a chapter of a book");
displayTasks();

console.log("\n--- Completing a Task ---");

markTaskComplete(1); // Mark 'Buy groceries' as complete
markTaskComplete(3); // Mark 'Clean the kitchen' as complete
displayTasks();

console.log("\n--- Deleting a Task ---");
deleteTask(3); // Delete 'Finish Week 4 assignment'
// displayTasks();