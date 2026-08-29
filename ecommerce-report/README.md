# 🛒 E-Commerce Data Report

A Node.js script that processes an array of e-commerce transaction data to generate a summary report.
This project demonstrates mastery of functional array methods such as **.filter(), .map(), and .reduce()** by building a structured report object from a complex dataset.

## 🎯 Objective

To write a JavaScript program **(ecommerce-report.js)** that calculates:

1. **Total Revenue** – The total value of all completed transactions.

2. **Customer Spending Report** – The total amount each customer has spent.

## ⚙️ Setup

1. Create a file named:

```bash
ecommerce-report.js
```

2. Copy the given starter data structure into the file:

```javascript
const transactions = [
  { id: 'tr_1', customerId: 'c_1', status: 'completed', items: [{ productId: 'p_1', price: 50, quantity: 2 }] },
  { id: 'tr_2', customerId: 'c_2', status: 'completed', items: [{ productId: 'p_3', price: 120, quantity: 1 }] },
  { id: 'tr_3', customerId: 'c_1', status: 'completed', items: [{ productId: 'p_2', price: 25, quantity: 3 }] },
  { id: 'tr_4', customerId: 'c_3', status: 'completed', items: [{ productId: 'p_4', price: 80, quantity: 1 }] },
];
```

## 🧠 Logic & Approach
**Step 1: Filter Completed Transactions**

Use .filter() to select only transactions where status === 'completed'.

**Step 2: Use .reduce() to Build the Report**

Initialize your reduce accumulator as:

```javascript
{ totalRevenue: 0, customers: {} }
```

For each transaction:

1. Use another .reduce() on the items array to calculate that transaction’s total cost (price * quantity).

2. Add the transaction total to acc.totalRevenue.

3. Update acc.customers[customerId]:

    - If the customer already exists, add to their total.

    - Otherwise, create a new entry with their first transaction total.

Always return the accumulator at the end of the callback.

## 🧾 Expected Output

After processing, log the final report object:

```javascript
{
  totalRevenue: 350,
  customers: {
    c_1: 150,
    c_2: 120,
    c_3: 80
  }
}
```

## 🧰 Concepts Practiced

- Functional Array Methods (filter, map, reduce)

- Nested data manipulation

- Object property updates

- ES6+ arrow functions and concise syntax

## ▶️ Run the Program

Use Node.js to execute the file:

```bash
node ecommerce-report.js
```
The final report will print to the console.

## 📤 Submission

- Save your completed file as **ecommerce-report.js.**

- Submit it via a Pull Request to your personal assignments repository.

- Follow the professional branching workflow taught in class.

[Back To Home](../README.md)