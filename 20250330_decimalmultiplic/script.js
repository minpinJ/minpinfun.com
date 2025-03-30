// Game state
const gameState = {
  phase: 'ready', // ready, playing, ended
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 10,
  selectedAnswerIndex: null,
  isAnswered: false,
};

// Audio state
const audioState = {
  isMuted: false,
  backgroundMusic: document.getElementById('background-music'),
  successSound: document.getElementById('success-sound'),
  wrongSound: document.getElementById('wrong-sound'),
};

// DOM Elements
const screens = {
  instruction: document.getElementById('instruction-screen'),
  game: document.getElementById('game-screen'),
  complete: document.getElementById('complete-screen'),
};

const elements = {
  startButton: document.getElementById('start-button'),
  restartButton: document.getElementById('restart-button'),
  toggleSoundButton: document.getElementById('toggle-sound'),
  score: document.getElementById('score'),
  correctCount: document.getElementById('correct-count'),
  accuracy: document.getElementById('accuracy'),
  questionNumber: document.getElementById('question-number'),
  progressPercentage: document.getElementById('progress-percentage'),
  progressFill: document.getElementById('progress-fill'),
  questionText: document.getElementById('question-text'),
  answersContainer: document.getElementById('answers'),
  feedback: document.getElementById('feedback'),
  finalScore: document.getElementById('final-score'),
  finalPercentage: document.getElementById('final-percentage'),
  finalProgressFill: document.getElementById('final-progress-fill'),
  finalMessage: document.getElementById('final-message'),
  confettiCanvas: document.getElementById('confetti-canvas'),
};

// Initialize event listeners
function initEventListeners() {
  elements.startButton.addEventListener('click', startGame);
  elements.restartButton.addEventListener('click', restartGame);
  elements.toggleSoundButton.addEventListener('click', toggleSound);
  
  // Start audio on first user interaction
  document.addEventListener('click', initAudio, { once: true });
}

// Initialize audio
function initAudio() {
  audioState.backgroundMusic.volume = 0.3;
  audioState.successSound.volume = 0.5;
  audioState.wrongSound.volume = 0.5;
  
  // Try to play background music
  audioState.backgroundMusic.play().catch(err => {
    console.log('Audio play failed:', err);
  });
}

// Toggle sound
function toggleSound() {
  audioState.isMuted = !audioState.isMuted;
  
  // Update all audio elements
  audioState.backgroundMusic.muted = audioState.isMuted;
  audioState.successSound.muted = audioState.isMuted;
  audioState.wrongSound.muted = audioState.isMuted;
  
  // Update button icon
  elements.toggleSoundButton.querySelector('.icon').textContent = 
    audioState.isMuted ? '🔇' : '🔊';
}

// Show specified screen
function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show requested screen
  screens[screenName].classList.add('active');
}

// Start the game
function startGame() {
  gameState.phase = 'playing';
  gameState.questions = generateQuestionSet(gameState.totalQuestions);
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  
  showScreen('game');
  updateScoreDisplay();
  loadQuestion();
}

// Restart the game
function restartGame() {
  startGame();
}

// Load current question
function loadQuestion() {
  if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
    endGame();
    return;
  }
  
  const question = gameState.questions[gameState.currentQuestionIndex];
  
  // Reset state
  gameState.selectedAnswerIndex = null;
  gameState.isAnswered = false;
  
  // Update question display
  elements.questionText.textContent = question.question;
  elements.answersContainer.innerHTML = '';
  
  // Create answer buttons
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = option;
    button.dataset.index = index;
    button.addEventListener('click', () => selectAnswer(index));
    
    elements.answersContainer.appendChild(button);
  });
  
  // Update progress
  updateProgress();
  
  // Hide feedback
  elements.feedback.classList.remove('visible', 'correct', 'wrong');
  elements.feedback.classList.add('hidden');
}

// Select an answer
function selectAnswer(index) {
  if (gameState.isAnswered) return;
  
  const question = gameState.questions[gameState.currentQuestionIndex];
  const isCorrect = index === question.correctIndex;
  
  gameState.selectedAnswerIndex = index;
  gameState.isAnswered = true;
  
  // Update score if correct
  if (isCorrect) {
    gameState.score++;
    audioState.successSound.play().catch(err => console.log('Audio play failed:', err));
    showConfetti();
  } else {
    audioState.wrongSound.play().catch(err => console.log('Audio play failed:', err));
  }
  
  // Update score display
  updateScoreDisplay();
  
  // Update answer buttons
  const buttons = elements.answersContainer.querySelectorAll('.answer-button');
  buttons.forEach((button, buttonIndex) => {
    // Disable all buttons
    button.classList.add('disabled');
    
    // Mark selected answer
    if (buttonIndex === index) {
      button.classList.add(isCorrect ? 'correct' : 'wrong');
    }
    
    // Mark correct answer if wrong answer was selected
    if (!isCorrect && buttonIndex === question.correctIndex) {
      button.classList.add('correct');
    }
  });
  
  // Show feedback
  showFeedback(isCorrect, question.options[question.correctIndex]);
  
  // Move to next question after delay
  setTimeout(() => {
    gameState.currentQuestionIndex++;
    loadQuestion();
  }, 2000);
}

// Show feedback message
function showFeedback(isCorrect, correctAnswer) {
  elements.feedback.textContent = isCorrect ? 
    'Great job! That\'s correct!' : 
    `Sorry, that's not right. The correct answer is ${correctAnswer}.`;
  
  elements.feedback.classList.remove('hidden');
  elements.feedback.classList.add('visible', isCorrect ? 'correct' : 'wrong');
}

// Update score display
function updateScoreDisplay() {
  elements.score.textContent = gameState.score;
  elements.correctCount.textContent = `${gameState.score}/${gameState.currentQuestionIndex}`;
  
  // Calculate and display accuracy
  const accuracy = gameState.currentQuestionIndex > 0 ? 
    Math.round((gameState.score / gameState.currentQuestionIndex) * 100) : 0;
  elements.accuracy.textContent = `${accuracy}%`;
}

// Update progress display
function updateProgress() {
  const currentQuestion = gameState.currentQuestionIndex + 1;
  const total = gameState.totalQuestions;
  const percentage = Math.round((currentQuestion / total) * 100);
  
  elements.questionNumber.textContent = `Question ${currentQuestion} of ${total}`;
  elements.progressPercentage.textContent = `${percentage}%`;
  elements.progressFill.style.width = `${percentage}%`;
}

// End the game
function endGame() {
  gameState.phase = 'ended';
  
  // Calculate final stats
  const percentage = Math.round((gameState.score / gameState.totalQuestions) * 100);
  
  // Update display
  elements.finalScore.textContent = `${gameState.score}/${gameState.totalQuestions}`;
  elements.finalPercentage.textContent = `${percentage}%`;
  
  // Set progress bar color based on score
  let progressColor;
  if (percentage >= 80) {
    progressColor = '#22c55e'; // Green
  } else if (percentage >= 60) {
    progressColor = '#f59e0b'; // Yellow
  } else {
    progressColor = '#ef4444'; // Red
  }
  elements.finalProgressFill.style.backgroundColor = progressColor;
  
  // Animate progress bar
  setTimeout(() => {
    elements.finalProgressFill.style.width = `${percentage}%`;
  }, 100);
  
  // Set final message
  elements.finalMessage.textContent = getFinalMessage(percentage);
  
  // Show confetti for good scores
  if (percentage >= 60) {
    showConfetti();
  }
  
  // Show complete screen
  showScreen('complete');
}

// Get final message based on score
function getFinalMessage(percentage) {
  if (percentage === 100) return "Perfect Score! Amazing job!";
  if (percentage >= 80) return "Great job! You're a decimal multiplication expert!";
  if (percentage >= 60) return "Good work! You're understanding decimal multiplication!";
  if (percentage >= 40) return "Nice effort! Keep practicing to improve!";
  return "Keep practicing! Decimal multiplication takes time to master.";
}

// Generate a question with decimal values
function generateQuestion(level = 1) {
  // Adjust difficulty based on level (1-3)
  let num1, num2, question, answer;
  
  // Generate decimal numbers appropriate for level
  if (level === 1) {
    // Level 1: Simple tenths by whole numbers
    num1 = (Math.floor(Math.random() * 9) + 1) / 10;
    num2 = Math.floor(Math.random() * 5) + 1;
  } else if (level === 2) {
    // Level 2: Tenths by tenths or whole numbers
    num1 = (Math.floor(Math.random() * 9) + 1) / 10;
    if (Math.random() > 0.5) {
      num2 = (Math.floor(Math.random() * 9) + 1) / 10;
    } else {
      num2 = Math.floor(Math.random() * 5) + 1;
    }
  } else {
    // Level 3: Hundredths by tenths or whole numbers
    if (Math.random() > 0.5) {
      num1 = (Math.floor(Math.random() * 99) + 1) / 100;
    } else {
      num1 = (Math.floor(Math.random() * 9) + 1) / 10 + (Math.floor(Math.random() * 9) + 1) / 100;
    }
    
    if (Math.random() > 0.5) {
      num2 = (Math.floor(Math.random() * 9) + 1) / 10;
    } else {
      num2 = Math.floor(Math.random() * 5) + 1;
    }
  }
  
  // Round numbers to ensure clean decimals
  num1 = Math.round(num1 * 100) / 100;
  num2 = Math.round(num2 * 100) / 100;
  
  // Calculate answer
  answer = Math.round((num1 * num2) * 100) / 100;
  
  // Format the question
  question = `${num1} × ${num2} = ?`;
  
  // Generate incorrect options
  const options = generateIncorrectOptions(answer, level);
  
  // Shuffle options and determine correct index
  const allOptions = [answer.toString(), ...options];
  const shuffledOptions = shuffleArray(allOptions);
  const correctIndex = shuffledOptions.indexOf(answer.toString());
  
  return {
    question,
    options: shuffledOptions,
    correctIndex
  };
}

// Generate incorrect options for multiple choice
function generateIncorrectOptions(correctAnswer, level) {
  const options = new Set();
  
  // Generate options until we have 2 unique incorrect answers
  while (options.size < 2) {
    let wrongAnswer;
    
    // Different error patterns based on level
    if (Math.random() < 0.4) {
      // Decimal point error (common mistake)
      wrongAnswer = correctAnswer * 10;
    } else if (Math.random() < 0.7) {
      // Small variation (slightly off)
      const variation = correctAnswer * (0.1 + Math.random() * 0.3);
      wrongAnswer = Math.round((correctAnswer + (Math.random() > 0.5 ? variation : -variation)) * 100) / 100;
    } else {
      // Random answer within range
      wrongAnswer = Math.round((correctAnswer * (0.5 + Math.random() * 1.5)) * 100) / 100;
    }
    
    // Ensure positive values and reasonable range
    wrongAnswer = Math.abs(wrongAnswer);
    
    // Add wrong answer if it's different from correct answer
    if (Math.abs(wrongAnswer - correctAnswer) > 0.01) {
      options.add(wrongAnswer.toString());
    }
  }
  
  return Array.from(options);
}

// Generate a set of questions for the game
function generateQuestionSet(totalQuestions = 10) {
  const questions = [];
  
  // Distribute questions across difficulty levels
  const easyCount = Math.floor(totalQuestions * 0.3);
  const mediumCount = Math.floor(totalQuestions * 0.4);
  const hardCount = totalQuestions - easyCount - mediumCount;
  
  // Add questions of each level
  for (let i = 0; i < easyCount; i++) {
    questions.push(generateQuestion(1));
  }
  
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateQuestion(2));
  }
  
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateQuestion(3));
  }
  
  // Shuffle the questions
  return shuffleArray(questions);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Simple confetti effect
function showConfetti() {
  elements.confettiCanvas.classList.remove('hidden');
  const canvas = elements.confettiCanvas;
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Confetti particles
  const particles = [];
  const particleCount = 150;
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 0.2 - 0.1,
      rotationSpeed: Math.random() * 0.01 - 0.005
    });
  }
  
  // Animation loop
  let animationFrame;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let completed = true;
    
    // Update and draw particles
    particles.forEach(p => {
      p.y += p.speed;
      p.x += Math.sin(p.angle) * 2;
      p.angle += p.rotation;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      
      // Check if any particles still on screen
      if (p.y < canvas.height) {
        completed = false;
      }
    });
    
    // Continue or stop animation
    if (!completed) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      elements.confettiCanvas.classList.add('hidden');
      cancelAnimationFrame(animationFrame);
    }
  };
  
  // Start animation
  animate();
  
  // Clean up after 3 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    elements.confettiCanvas.classList.add('hidden');
  }, 3000);
}

// Initialize the game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  showScreen('instruction');
});