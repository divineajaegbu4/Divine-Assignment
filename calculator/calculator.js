const calculator = (leftOperand, operator, rightOperand) => {
  let result;

  if (typeof leftOperand !== "number" || typeof rightOperand !== "number") {
    return "Invalid number";
  }

  if (operator === "/" && rightOperand === 0) {
    return "Cannot divide by 0";
  }

  // Valid calculations
  switch (operator) {
    case "+":
      result = leftOperand + rightOperand;
      break;
    case "-":
      result = leftOperand - rightOperand;
      break;
    case "*":
      result = leftOperand * rightOperand;
      break;
    case "/":
      result = leftOperand / rightOperand;
      break;
    case "%":
      result = leftOperand % rightOperand;
      break;
    case "**":
      result = leftOperand ** rightOperand;
      break;
    default:
      result = "Not a number";
  }

  // convert the number into a string that looks nice for humans to read - it adds commas automatically
  return result.toLocaleString("en-US", {
    minimumFractionDigits: 0, // Don’t force any decimal digits unless the number has them.
    maximumFractionDigits: 15, // show up to 15 decimals
  });
};

const getCalculator = calculator(44524, "**", 4/2);

console.log(getCalculator);
