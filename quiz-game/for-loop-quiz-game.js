import axios from "axios";
import promptSync from "prompt-sync";
const prompt = promptSync();

const retrieveQuestions = async () => {
  try {
    const start = Date.now();
    const response = await axios.get(
      "https://the-trivia-api.com/v2/questions?limit=200"
    );
    const data = await response.data;
    const end = Date.now();

    const timeTaken = end - start;

    console.log(
      `💾 Data successfully loaded in ${Math.floor(timeTaken / 1000)} seconds`
    );
    return data;
  } catch (err) {
    console.log(`Error:`, err);
  }
};

// retrieveQuestions().then(data => console.log(data))

const quizGame = async () => {
  try {
    const optionLetters = ["A", "B", "C", "D"];

    const getData = await retrieveQuestions();

    const category = prompt("Choose your category:");
    const levels = prompt("Choose your difficulty level:");

    const getMatchCategoryAndLevels = getData.filter(
      (data) => data.category === category && data.difficulty === levels
    );

    const filterLength = getMatchCategoryAndLevels.length;

    if (filterLength === 0) {
      console.log("No questions");
      return;
    }

    for (let attempt = 0; attempt < filterLength; attempt++) {
      console.log(`Question ${attempt + 1} of ${filterLength}`);
      const randomQuestion = Math.floor(Math.random() * filterLength);
      const getSpecificQuestion = getMatchCategoryAndLevels[randomQuestion];

      const options = [...getSpecificQuestion.incorrectAnswers];
      console.log(options);
      const correctAnswer = getSpecificQuestion.correctAnswer;

      const correctAnswerRandomPosition = Math.floor(
        Math.random() * (options.length + 1)
      );

      options.splice(correctAnswerRandomPosition, 0, correctAnswer);

      console.log(correctAnswer);

      prompt(`Question: ${getSpecificQuestion.question.text}`);

      options.forEach((option, index) => {
        const letter = optionLetters[index];
        console.log(`${letter}: ${option}`);
      });

      const selectOption = prompt("Select option(A-D):");

      const index = optionLetters.findIndex(
        (option) => option === selectOption.toUpperCase()
      );

      if (index === -1) {
        console.log("Option not found");
      } else if (options[index] === correctAnswer) {
        console.log(`Congratulations! You got it ${correctAnswer}`);
      } else {
        console.log(`Wrong Answer! try again`);
        console.log(`Correct Answer: ${correctAnswer}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

quizGame();
