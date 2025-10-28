# 🌍 Universal Translator

A simple JavaScript program that demonstrates how to use **conditional logic**(if...else if...else) to produce different outputs based on an input variable.
This exercise helps solidify your understanding of **control flow** and **decision-making** in JavaScript.

## 🎯 Objective

To create a program that displays a greeting message in different languages depending on a given **language code**.

⚙️ Setup

1. Create a file named:

```bash
translator.js
``` 

2. Inside the file, define the following variables:

```javascript
const languageCode = 'es'; // Try 'fr', 'de', 'en', etc.
let greeting; // Will hold the final translated message
```

🧠 Logic

Use an if / else if / else statement to check the value of languageCode and assign the correct greeting.

Example logic:

```javascript
if (languageCode === 'es') {
  greeting = 'Hola, Mundo';
} else if (languageCode === 'fr') {
  greeting = 'Bonjour, le monde';
} else if (languageCode === 'de') {
  greeting = 'Hallo, Welt';
} else {
  greeting = 'Hello, World'; // Default (English or others)
}
```

💻 Output

Finally, print the greeting to the console:

console.log(greeting);

```javascript
console.log(greeting);
```

Example Results:

|Language Code|     Output      |
|-------------|-----------------|
|      es     | Hola, Mundo     |
|      fr     | Bonjour, le monde|
|      de     | Hallo, Welt     |
|      en     | Hello, World    |

📤 Submission

- Save your work in translator.js.

- Submit the file via a Pull Request to your personal assignments repository.

- Follow the branching workflow learned last week.