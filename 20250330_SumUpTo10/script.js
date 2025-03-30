// Game Configuration
const gameConfig = {
  totalQuestions: 10,
  maxSum: 10,
  fruits: ['apple', 'banana', 'orange', 'strawberry']
};

// Game State
let gameState = {
  score: 0,
  currentQuestion: 1,
  totalQuestions: gameConfig.totalQuestions,
  firstPileCount: 0,
  secondPileCount: 0,
  correctAnswer: 0,
  gameCompleted: false,
  showFeedback: false,
  isCorrect: false,
  userSelectedAnswer: null
};

// DOM Elements
const scoreValue = document.getElementById('score-value');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const progressIndicator = document.getElementById('progress-indicator');
const firstPileElement = document.getElementById('first-pile');
const secondPileElement = document.getElementById('second-pile');
const answerOptionsElement = document.getElementById('answer-options');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const playAgainButton = document.getElementById('play-again-btn');

// Initialize Game
function initGame() {
  // Set up initial display
  totalQuestionsElement.textContent = gameConfig.totalQuestions;
  resetGame();
}

// Reset Game
function resetGame() {
  gameState = {
    score: 0,
    currentQuestion: 1,
    totalQuestions: gameConfig.totalQuestions,
    firstPileCount: 0,
    secondPileCount: 0,
    correctAnswer: 0,
    gameCompleted: false,
    showFeedback: false,
    isCorrect: false,
    userSelectedAnswer: null
  };
  
  updateDisplay();
  generateQuestion();
}

// Update Display
function updateDisplay() {
  // Update score and question counter
  scoreValue.textContent = gameState.score;
  currentQuestionElement.textContent = gameState.currentQuestion;
  
  // Update progress bar
  const progressPercentage = (gameState.currentQuestion - 1) / gameState.totalQuestions * 100;
  progressIndicator.style.width = `${progressPercentage}%`;
  
  // Hide/show feedback
  feedbackElement.classList.add('hidden');
  
  // Hide/show buttons
  nextButton.classList.add('hidden');
  playAgainButton.classList.add('hidden');
  
  if (gameState.gameCompleted) {
    playAgainButton.classList.remove('hidden');
  }
}

// Generate Question
function generateQuestion() {
  // Generate random numbers for the two piles
  const max = Math.min(gameConfig.maxSum - 1, 5); // Max 5 per pile
  gameState.firstPileCount = Math.floor(Math.random() * max) + 1; // At least 1
  gameState.secondPileCount = Math.floor(Math.random() * (gameConfig.maxSum - gameState.firstPileCount)) + 1; // At least 1
  
  gameState.correctAnswer = gameState.firstPileCount + gameState.secondPileCount;
  
  // Clear piles
  firstPileElement.innerHTML = '';
  secondPileElement.innerHTML = '';
  
  // Populate piles with fruits
  populatePile(firstPileElement, gameState.firstPileCount);
  populatePile(secondPileElement, gameState.secondPileCount);
  
  // Generate answer options
  generateAnswerOptions();
}

// Populate Object Pile
function populatePile(pileElement, count) {
  for (let i = 0; i < count; i++) {
    const fruit = document.createElement('img');
    // Select a random fruit type
    const fruitType = gameConfig.fruits[Math.floor(Math.random() * gameConfig.fruits.length)];
    fruit.src = `${fruitType}.svg`;
    fruit.alt = fruitType;
    fruit.className = 'fruit';
    pileElement.appendChild(fruit);
  }
}

// Generate Answer Options
function generateAnswerOptions() {
  // Clear previous options
  answerOptionsElement.innerHTML = '';
  
  // Create array of possible answers
  const correctAnswer = gameState.correctAnswer;
  let answers = [correctAnswer];
  
  // Add 3 more unique options
  while (answers.length < 4) {
    const randomAnswer = Math.floor(Math.random() * gameConfig.maxSum) + 1;
    if (!answers.includes(randomAnswer)) {
      answers.push(randomAnswer);
    }
  }
  
  // Shuffle answers
  answers = shuffleArray(answers);
  
  // Create buttons for each answer option
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = answer;
    button.addEventListener('click', () => handleAnswerSelection(answer));
    answerOptionsElement.appendChild(button);
  });
}

// Handle Answer Selection
function handleAnswerSelection(selectedAnswer) {
  // If feedback is already showing, do nothing
  if (gameState.showFeedback) return;
  
  gameState.userSelectedAnswer = selectedAnswer;
  gameState.isCorrect = selectedAnswer === gameState.correctAnswer;
  gameState.showFeedback = true;
  
  // Update score if correct
  if (gameState.isCorrect) {
    gameState.score++;
    scoreValue.textContent = gameState.score;
  }
  
  // Disable all answer buttons
  const buttons = answerOptionsElement.querySelectorAll('.answer-button');
  buttons.forEach(button => {
    button.classList.add('disabled');
    
    // Highlight correct and incorrect answers
    if (parseInt(button.textContent) === gameState.correctAnswer) {
      button.classList.add('correct');
    } else if (parseInt(button.textContent) === selectedAnswer && !gameState.isCorrect) {
      button.classList.add('incorrect');
    }
  });
  
  // If this is a fruit in the correct pile, make it celebrate
  if (gameState.isCorrect) {
    const fruits = document.querySelectorAll('.fruit');
    fruits.forEach(fruit => {
      fruit.classList.add('celebrate');
    });
  }
  
  // Show feedback
  showFeedback();
  
  // Check if game is completed
  if (gameState.currentQuestion >= gameState.totalQuestions) {
    gameState.gameCompleted = true;
    playAgainButton.classList.remove('hidden');
  } else {
    nextButton.classList.remove('hidden');
  }
}

// Show Feedback
function showFeedback() {
  feedbackElement.innerHTML = '';
  feedbackElement.classList.remove('hidden', 'correct', 'incorrect');
  
  const feedbackContent = document.createElement('div');
  feedbackContent.className = 'feedback-content';
  
  const emoji = document.createElement('div');
  emoji.className = 'feedback-emoji';
  
  const message = document.createElement('div');
  message.className = 'feedback-text';
  
  if (gameState.isCorrect) {
    feedbackElement.classList.add('correct');
    emoji.textContent = '😃';
    message.textContent = '';
  } else {
    feedbackElement.classList.add('incorrect');
    emoji.textContent = '😕';
    message.textContent = '';
  }
  
  feedbackContent.appendChild(emoji);
  feedbackContent.appendChild(message);
  feedbackElement.appendChild(feedbackContent);
}

// Next Question
function nextQuestion() {
  gameState.currentQuestion++;
  gameState.showFeedback = false;
  
  updateDisplay();
  generateQuestion();
}

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
playAgainButton.addEventListener('click', resetGame);

// Initialize game on load
window.addEventListener('load', initGame);