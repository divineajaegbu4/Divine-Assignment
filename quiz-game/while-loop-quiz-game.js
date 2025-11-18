import axios from "axios";
import promptSync from "prompt-sync";
const prompt = promptSync();

const getQuestions = async () => {
  try {
    const response = await axios.get(
      "https://the-trivia-api.com/v2/questions?limit=200"
    );

    return await response.data;
  } catch (err) {
    console.log("Uncaught error:", err);
  }
};

const quizGame = async () => {
  const chooseCategory = prompt("Select your category:");
  const difficultyLevels = prompt("Select your difficulty levels: ");

  const questionsData = await getQuestions();

  const filterCategory = questionsData.filter(
    (data) =>
      data.category === chooseCategory && data.difficulty === difficultyLevels
  );

  let attempt = 0;
  let letters = ["a", "b", "c", "d"];

  try {
    while (attempt < filterCategory.length) {
      attempt++;
      console.log(`Questions ${attempt} of ${filterCategory.length}`);

      const randomCategory = Math.floor(Math.random() * filterCategory.length);

      const randomQuestions = filterCategory[randomCategory];

      const { incorrectAnswers: options, correctAnswer } = randomQuestions;

      const randomPosition = Math.floor(Math.random() * options.length + 1);

      options.splice(randomPosition, 0, correctAnswer);

      prompt(`Questions: ${randomQuestions.question.text}`);

      console.log(attempt);
      console.log(correctAnswer);

      options.forEach((option, index) => {
        const getLetters = letters[index];
        console.log(`${getLetters}. ${option}`);
      });
      const selectOption = prompt("Select option (A-D):");

      const index = letters.findIndex((letter) => letter === selectOption);

      if (index === -1) {
        console.log("Option does not exist");
      } else if (options[index] === correctAnswer) {
        console.log(
          `Congratulations! You have gotten the correct answer ${correctAnswer}`
        );
      } else {
        console.log("Wrong option! Keep on trying");
        console.log(`The correct answer is ${correctAnswer}`);
      }

    }
  } catch (err) {
    console.log("Error:", err);
  }
};

quizGame();
