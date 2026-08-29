# 🧮 Take-Home Assignment: Array Calculation Report

#### Objective

This exercise is designed to help you understand how to use **loops, functions, and basic array** operations in JavaScript to compute statistical data such as **sum, average, and maximum value** from an array of numbers.

#### Task Description

You are given an array of numbers representing data points, such as test scores or transaction amounts.
Your goal is to write a JavaScript program **(array-report.js)** that performs the following:

1. **Calculate the total sum** of all numbers in the array.

2. **Find the maximum value** in the array.

3. **Compute the average** of all numbers.

4. **Display the results** neatly in the console.

#### Code Overview

1. **The Data**

```javascript
const numbers = [22, 67, 33, 96, 88, 72, 49, 11, 53];
```
An array of numbers that will be used for the calculations.

2. **The calculateSum Function**

Loops through the array and adds all the elements together to find the total sum.

```javascript
const calculateSum = (arr) => {
  let sum = 0;
  for(let i = 0; i < arr.length; i++) {
      sum += arr[i];
  }
  return sum;
};
```

3. **The findMax Function**

Iterates through the array to find and return the largest number.

```javascript
const findMax = (arr) => {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
      if(arr[i] > max) {
          max = arr[i];
      }
  }
  return max;
};
```

4. **Calculations**

The sum, maximum, and average are calculated and stored in variables:

```javascript
const getCalculateSum = calculateSum(numbers);
const getFindMax = findMax(numbers);
const calculateAverage = getCalculateSum / numbers.length;
```


5. **Output**

Finally, the results are printed to the console in a clear format:

```javascript
console.log(`Sum: [${getCalculateSum}], Average: [${calculateAverage}], Max: [${getFindMax}]`);
```

**Expected Output**

```bash
Sum: [491], Average: [54.55555555555556], Max: [96]
```

**Submission**
Submit your array-report.js file via a Pull Request to your personal assignments repository, following the standard branching workflow you’ve learned in class.

[Back To Home](../README.md)

