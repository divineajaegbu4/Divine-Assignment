import axios from "axios";

import promptSync from "prompt-sync";

const prompt = promptSync();

let randomIndex;
let attempt = 0;
let time = 10
const letters = ["A", "B", "C", "D"];

const questions = async () => {
  const response = await axios.get(
    "https://the-trivia-api.com/v2/questions?limit=200"
  );

  return await response.data;
};

const quizGame = async () => {
  try {
    const getData = await questions();

    const category = prompt("Choose your category:");

    const levels = prompt("Choose the difficulty levels:");

    const dataIdLength = getData.map((data) => data.id.length);

    getData.forEach((data) => {
      console.log("------------------------------------");
      console.log(`${data.category} ${data.question.text} ${data.difficulty}`);
    });

    console.log("==================================");

    const getCategory = getData.filter(
      (data) => data.category === category && data.difficulty === levels
    );

    if(getCategory.length === 0) {
        throw new Error("🤔 No question available!")
    }

    const start = Date.now()
    do {
      randomIndex = Math.floor(Math.random() * dataIdLength.length); // 50
      attempt++;

      console.log(randomIndex);
      console.log(`Question ${attempt} of ${getCategory.length}`);
      const guessQuestions = getData[randomIndex];

      const randomCategoryIndex = Math.floor(
        Math.random() * getCategory.length
      );
      const randomQuestion = getCategory[randomCategoryIndex];

     const askQuestion = prompt(`Question: ${randomQuestion.question.text}`);

     if(askQuestion) {
        time--
        console.log(`Time left: ${time}seconds`);
     }

      const correctOption = guessQuestions.correctAnswer;

      const options = guessQuestions.incorrectAnswers;

      const randomPosition = Math.floor(Math.random() * (options.length + 1));

      options.splice(randomPosition, 0, correctOption);

      options.forEach((option, index) => {
        const getLetters = letters[index];

        console.log(`${getLetters}. ${option}`);
      });

      console.log("CorrectAnswer:", correctOption);
      const selectOption = prompt("Select option (A-D):");

      const index = letters.findIndex(
        (letter) => letter === selectOption.toUpperCase()
      );

      if (index === -1) {
        console.log("Letter not found");
      } else if (options[index] === correctOption) {
        console.log(`🌟 Brilliant! That’s the right answer! ${options[index]}`);
      } else {
        console.log(`😢 Nope! Better luck on the next question.`);
        console.log(`The correct answer is: ${correctOption}`);
      }
    } while (attempt < getCategory.length);
    const end = Date.now();

    const totalTimeTaken = end - start;

    console.log(`Total time taken: ${Math.floor(totalTimeTaken/1000)}seconds`);
  } catch (err) {
    console.log("Error:", err.message);
  }
};

quizGame();
