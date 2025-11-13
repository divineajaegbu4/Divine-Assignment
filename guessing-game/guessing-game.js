const prompt = require("prompt-sync")()

let attempts = 0;
let score = 0;
let minAttempts = 5;
let maxAttempts;
let guessingNum;
let timeStart;
let timeEnd;
let totalTime;

const chooseNum = Number(prompt("Choose a level of the game:"))


timeStart = Date.now()
do {
  const guess = Number(prompt("Enter a guess:"))
  const increaseScoreBy5 = score += 5;
  attempts++

  // choose the number you want to play with
  switch(chooseNum) {
    case 10:
      maxAttempts = 10
      guessingNum = Math.floor(Math.random() * 10) + 1
      break;
    case 20:
       maxAttempts = 100
       guessingNum = Math.floor(Math.random() * 100) + 1
       break;
    default:
      maxAttempts = 3;
      guessingNum = Math.floor(Math.random() * 15) + 1
  }


console.log(`Attempt ${attempts}: You guessed ${guess}`)

// stop at 5 if they guess wrongly
  if(attempts === 5 && guess !== guessingNum) {
    increaseScoreBy5
    console.log(`🏁 Game over! The correct number was ${guessingNum} and final score is ${score} points.`)
    break;
  }


if(guess > maxAttempts) {
  console.log(`⚠️ Out of range! Please enter a number between 1 and ${maxAttempts}.`)
}else if(guess < guessingNum) {
    minAttempts--
    increaseScoreBy5
    console.log("⬆️ Too high! try again")
    console.log(`✨ +${score} point added to your score!`);
  }else if(guess > guessingNum) {
    minAttempts--
    increaseScoreBy5
    console.log("⬇️ Too low! try again")
    console.log(`✨ +${score} point added to your score!`);
  }else if(guess === guessingNum) {
     score += 10 
    console.log(`🎉 Correct! You got it in ${attempts} ${attempts === 1 ? "try":"tries"}!`)
    console.log(`✨ +${score} point added to your score!`);
  }else {
    console.log("⚠️ Hmm… that doesn’t look like a number. Try again!")
  }

  // attempts left as they decrease with each wrong guess
  switch(minAttempts) {
    case 4:
      console.log(`🎯 You have ${minAttempts} guesses left. Good luck!`)
      break;
    case 3:
      console.log(`⌛ You have ${minAttempts} attempts left. Keep trying!`);
      break;
    case 2:
      console.log(`🕹️ Only ${minAttempts} attempts remaining. Choose wisely!`);
      break;
    case 1:
      console.log(`⚠️ ${minAttempts} attempt left! Make it count!`);
      break;
    default:  
  }
 

}while(attempts < maxAttempts)// Loop continues until attempts reaches maxAttempts


timeEnd = Date.now();

totalTime = timeEnd - timeStart;

console.log(`🎉 Score Update: You’ve reached ${score} points!`)
console.log("👏 You did it! Game completed successfully.")
console.log(`Total time taken: ${Math.floor(totalTime/1000)}s`);//Use Math.floor here to remove decimals

