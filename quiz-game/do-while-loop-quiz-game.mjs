import axios from "axios";

import promptSync from "prompt-sync";

const prompt = promptSync();

// let randomIndex;
let attempt = 0;
let lives = 3;
let score = 0;

const letters = ["A", "B", "C", "D"];

// Fetching questions from the API
const questions = async () => {
  const start = Date.now();
  const response = await axios.get(
    "https://the-trivia-api.com/v2/questions?limit=200"
  );

  const data = await response.data;
  const end = Date.now();

  const totalTime = end - start;

  console.log(
    `💾 Data successfully loaded in ${Math.floor(totalTime / 1000)} seconds.`
  );
  return data;
};

const quizGame = async () => {
  try {
    const start = Date.now();

    //Consume questions data here
    const getData = await questions();

    const category = prompt("Choose your category:");

    const levels = prompt("Choose your difficulty levels:");

    const dataIdLength = getData.map((data) => data.id.length);

    getData.forEach((data) => {
      console.log("------------------------------------");
      console.log(`${data.category} ${data.question.text} ${data.difficulty}`);
    });

    console.log("==================================");

    const getCategory = getData.filter(
      (data) => data.category === category && data.difficulty === levels
    );

    // console.log("getCategory:", getCategory);

    if (getCategory.length === 0) {
      throw new Error("🤔 No question available!");
    }

    do {
      // Generate a random index based on the number of IDs in dataIdLength
      const randomIndex = Math.floor(Math.random() * dataIdLength.length);
      attempt++;

      // Display the current question number out of total questions
      console.log(`Question ${attempt} of ${getCategory.length}`);

      // Select a random question from getData using the random index
      const guessQuestions = getData[randomIndex];

      // Generate a random index based on the number of items in getCategory
      const randomCategoryIndex = Math.floor(
        Math.random() * getCategory.length
      );

      // Select a random question from getCategory using the random index
      const randomQuestion = getCategory[randomCategoryIndex];

      prompt(`Question: ${randomQuestion.question.text}`);

      // Retrieve the correct answer from the randomly selected question
      const correctOption = guessQuestions.correctAnswer;

      // Retrieve the incorrect answers from the randomly selected question
      // It is an array of incorrect answers
      const options = guessQuestions.incorrectAnswers;

      // Generate a random position (0 to options.length) where the correct answer will be inserted
      const randomPosition = Math.floor(Math.random() * (options.length + 1));

      // Insert the correct answer into the options array at the randomly chosen position
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
      } else if (attempt === 3 && options[index] === correctOption) {
        console.log("🔥 Combo x2 activated! Points doubled!");
        score += 20;
      } else if (options[index] === correctOption) {
        console.log(`🌟 Brilliant! That’s the right answer! ${options[index]}`);
        console.log(`🎯 Spot on! +10 points earned!`);

        score += 10; //Update After printing it
      } else {
        lives--;
        console.log(`😢 Nope! Better luck on the next question.`);
        console.log(`The correct answer is: ${correctOption}`);
        console.log(`💔 Wrong answer! You lost ${attempt} life.`);
        console.log(`😢 Oops! That’s -5 points. Try again!`);

        score -= 5; //Update After printing it
      }

      if (lives === 0) {
        console.log(`💀 GAME OVER! Thanks for playing.`);
        break;
      }
    } while (attempt < getCategory.length);
    console.log(`Total score: ${score} points`);
    const end = Date.now();

    const totalTimeTaken = end - start;

    console.log(
      `Total time taken: ${Math.floor(totalTimeTaken / 1000)}seconds`
    );
  } catch (err) {
    console.log("Error:", err.message);
  }
};

quizGame();
