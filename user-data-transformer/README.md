# 👥 User Data Transformer

A simple Node.js program that simulates fetching and transforming user data using **modern JavaScript (ES6+) features** such as Promises, async/await, destructuring, and arrow functions.
This exercise helps you understand how to handle asynchronous data and transform it efficiently.

## 🎯 Objective

To create a small application that:

- Simulates fetching user data with a Promise

- Uses async/await for asynchronous processing

- Transforms the data using .map() and destructuring

- Outputs a simplified version of the data

⚙️ Setup

1.  Create a file named:

```bash
app.js
```

2. Make sure Node.js is installed on your system.
You’ll run the program with:

```bash
node app.js
```

## 🧠 Logic & Implementation Steps

1️⃣ mockFetchUsers Function

-Returns a Promise that resolves to an array of user objects.

- Example mock data:

```javascript
[
  { name: "Alice", company: "TechCorp", age: 25 },
  { name: "Bob", company: "InnovateX", age: 30 }
]
```

## 2️⃣ processUsers Function

- An async function that:

    - Awaits the result of mockFetchUsers().

    - Uses .map() with an arrow function to transform each user.

    - Destructures name and company from each user object.

   - Returns a new simplified array, e.g.:

```javascript
[
  { name: "Alice", company: "TechCorp" },
  { name: "Bob", company: "InnovateX" }
]
```

## 3️⃣ Logging the Result

At the end of your file, call:

```javascript
processUsers().then(console.log);
```

(or use await inside an async IIFE).

## 🧾 Example Output

When you run:

```bash
node app.js
```

You should see something like:

```javascript
[
  { name: "Alice", company: "TechCorp" },
  { name: "Bob", company: "InnovateX" }
]
``` 

## 📦 Key Concepts Practiced

- Promises

- Async/Await

- Arrow Functions

- Array.map()

- Object Destructuring

[Back To Home](../README.md)