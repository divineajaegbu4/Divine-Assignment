# 🧩 API Processor

This project is a simple Node.js program that fetches a list of users and their corresponding completed to-do items from the [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
 API.
It demonstrates how to handle asynchronous operations, Promise chaining, and data transformation in JavaScript.

## 🚀 Task Overview

The goal is to create a file called api-processor.js that performs the following steps:

1. Fetch all users from the API.

2. For each user, fetch their to-do list from the API.

3. Filter only completed to-dos for each user.

4. Return a structured result that combines user details with their completed to-do titles.

## ⚙️ Setup Instructions

1. **Initialize a Node.js project**

Run the command below to create a new Node.js project:

```bash
npm init -y
```

2. **Install Dependencies**

Install axios for making HTTP requests:

```bash
npm install axios
```

3. **Create the Script**

Create a new file named:

```bash
touch api-processor.js
```

🧠 Logic & Implementation

Inside api-processor.js, follow these main steps:

1. Create an async function called **getUserTodos**.

2. Fetch users from the endpoint:

```bash
https://jsonplaceholder.typicode.com/users
```     

3. For each user, create a promise to fetch their to-do list:

```bash
https://jsonplaceholder.typicode.com/todos?userId=USER_ID
```

4. Use Promise.all() to run all these requests concurrently.

5. For each user:

- Filter only the completed todos.

- Map those todos to their titles only.

6. Combine user data and todos using ES6 features such as:

- Object destructuring

- Array methods (.map, .filter)

- Spread syntax (...)


🧾 Expected Final Output

When the program runs successfully, it should log an array of user objects like this:

```javascript
[
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    todos: [
      'illo est ratione doloremque quia maiores aut',
      'vero reiciendis velit similique earum',
      // ... other completed todo titles
    ]
  },
  // ... other user objects
]
```

🧪 Running the Program

After writing your code, run the file using Node.js:

```bash
node api-processor.js
``` 

This should print the structured array of users and their completed todos to the console.

🧰 Summary of Key Concepts Used

- Async/Await for handling asynchronous API calls

- Axios for making HTTP requests

- Promise.all() for running multiple requests concurrently

- Array methods like .map() and .filter()

- Modern ES6+ features for cleaner, more readable code

📦 Submission

 Submit your **api-processor.js** and **package.json** files via a Pull Request
to your personal assignments repository.

[Back To Home](../README.md)