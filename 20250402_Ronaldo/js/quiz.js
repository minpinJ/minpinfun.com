/**
 * Cristiano Ronaldo Fan Quiz
 * A quiz application to test knowledge about the football legend
 */

// Quiz questions data
const quizData = [
    {
        question: "In which year was Cristiano Ronaldo born?",
        type: "multiple",
        options: ["1983", "1984", "1985", "1986"],
        answer: "1985",
        explanation: "Cristiano Ronaldo was born on February 5, 1985, in Funchal, Madeira, Portugal."
    },
    {
        question: "Which club did Ronaldo first play for professionally?",
        type: "multiple",
        options: ["Manchester United", "Sporting CP", "Real Madrid", "Juventus"],
        answer: "Sporting CP",
        explanation: "Ronaldo began his professional career with Sporting CP in Portugal before moving to Manchester United."
    },
    {
        question: "How many Ballon d'Or awards has Ronaldo won as of 2023?",
        type: "multiple",
        options: ["3", "4", "5", "7"],
        answer: "5",
        explanation: "Cristiano Ronaldo has won the prestigious Ballon d'Or award five times (2008, 2013, 2014, 2016, and 2017)."
    },
    {
        question: "In which year did Ronaldo first join Manchester United?",
        type: "multiple",
        options: ["2001", "2003", "2005", "2007"],
        answer: "2003",
        explanation: "Ronaldo joined Manchester United in 2003 after impressing Sir Alex Ferguson in a friendly match."
    },
    {
        question: "What is Ronaldo's iconic celebration called?",
        type: "text",
        answer: "Siu",
        alternateAnswers: ["Siuuu", "Si", "Siuu"],
        explanation: "Ronaldo's iconic celebration where he jumps, spins, and lands with arms outstretched is known as 'Siu' or 'Siuuu'."
    },
    {
        question: "Which national team does Cristiano Ronaldo captain?",
        type: "multiple",
        options: ["Brazil", "Spain", "Portugal", "Italy"],
        answer: "Portugal",
        explanation: "Ronaldo is the captain of the Portugal national team and has broken numerous records for his country."
    },
    {
        question: "How many UEFA Champions League titles has Ronaldo won as of 2023?",
        type: "multiple",
        options: ["3", "4", "5", "6"],
        answer: "5",
        explanation: "Cristiano has won 5 Champions League titles - one with Manchester United (2008) and four with Real Madrid (2014, 2016, 2017, 2018)."
    },
    {
        question: "In which stadium did Ronaldo play home matches for Real Madrid?",
        type: "text",
        answer: "Santiago Bernabeu",
        alternateAnswers: ["Bernabeu", "Santiago Bernabéu", "Bernabéu", "Santiago Barnabeu", "Santiago Barnabéu", "Barnabeu", "Barnabéu"],
        explanation: "The Santiago Bernabeu Stadium is the home stadium of Real Madrid, where Ronaldo played from 2009 to 2018."
    },
    {
        question: "What jersey number did Ronaldo primarily wear at Real Madrid?",
        type: "multiple",
        options: ["7", "9", "10", "11"],
        answer: "7",
        explanation: "Ronaldo has predominantly worn the number 7 jersey throughout his career, including at Real Madrid."
    },
    {
        question: "Which club did Ronaldo join after leaving Real Madrid in 2018?",
        type: "multiple",
        options: ["Manchester United", "PSG", "Juventus", "Al Nassr"],
        answer: "Juventus",
        explanation: "After leaving Real Madrid in 2018, Ronaldo joined Italian club Juventus before later returning to Manchester United."
    }
];

// Game state variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');

const progressBar = document.getElementById('progress-bar');
const currentQuestionElem = document.getElementById('current-question');
const totalQuestionsElem = document.getElementById('total-questions');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const textInputContainer = document.getElementById('text-input-container');
const textAnswer = document.getElementById('text-answer');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackAlert = document.getElementById('feedback-alert');
const feedbackText = document.getElementById('feedback-text');
const correctAnswerContainer = document.getElementById('correct-answer-container');
const correctAnswer = document.getElementById('correct-answer');

const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const resultMessage = document.getElementById('result-message');
const resultIcon = document.getElementById('result-icon');
const currentYear = document.getElementById('current-year');

// Initialize the quiz
function initQuiz() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Set total questions count
    totalQuestionsElem.textContent = quizData.length;
    maxScore.textContent = quizData.length;
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', submitAnswer);
    nextBtn.addEventListener('click', loadNextQuestion);
    retryBtn.addEventListener('click', restartQuiz);
    
    // Text input enter key
    textAnswer.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
}

// Start the quiz
function startQuiz() {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion(0);
}

// Load a specific question
function loadQuestion(index) {
    // Reset state
    selectedOption = null;
    feedbackContainer.classList.add('d-none');
    submitBtn.disabled = false;
    
    // Update progress indicators
    currentQuestionIndex = index;
    currentQuestionElem.textContent = index + 1;
    progressBar.style.width = `${((index) / quizData.length) * 100}%`;
    
    // Get current question
    const currentQuestion = quizData[index];
    questionText.textContent = currentQuestion.question;
    
    // Setup based on question type
    if (currentQuestion.type === 'multiple') {
        optionsContainer.classList.remove('d-none');
        textInputContainer.classList.add('d-none');
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create option buttons
        currentQuestion.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'option-btn';
            button.textContent = option;
            
            button.addEventListener('click', () => {
                // Deselect any previously selected option
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Select current option
                button.classList.add('selected');
                selectedOption = option;
            });
            
            optionsContainer.appendChild(button);
        });
    } else if (currentQuestion.type === 'text') {
        optionsContainer.classList.add('d-none');
        textInputContainer.classList.remove('d-none');
        textAnswer.value = '';
        setTimeout(() => textAnswer.focus(), 100);
    }
}

// Submit the current answer
function submitAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    let userAnswer = '';
    let isCorrect = false;
    
    // Get user's answer based on question type
    if (currentQuestion.type === 'multiple') {
        if (!selectedOption) {
            alert('Please select an answer');
            return;
        }
        userAnswer = selectedOption;
        isCorrect = userAnswer === currentQuestion.answer;
    } else if (currentQuestion.type === 'text') {
        userAnswer = textAnswer.value.trim();
        
        if (!userAnswer) {
            alert('Please enter your answer');
            return;
        }
        
        // Check against correct answer and alternate answers (case insensitive)
        const normalizedUserAnswer = userAnswer.toLowerCase();
        const normalizedCorrectAnswer = currentQuestion.answer.toLowerCase();
        
        isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        
        // Check alternate answers if provided
        if (!isCorrect && currentQuestion.alternateAnswers) {
            isCorrect = currentQuestion.alternateAnswers.some(alt => 
                normalizedUserAnswer === alt.toLowerCase()
            );
        }
    }
    
    // Update score
    if (isCorrect) {
        score++;
    }
    
    // Show feedback
    showFeedback(isCorrect, currentQuestion);
    
    // Disable submit button to prevent multiple submissions
    submitBtn.disabled = true;
}

// Show feedback after answering
function showFeedback(isCorrect, question) {
    feedbackContainer.classList.remove('d-none');
    
    if (isCorrect) {
        feedbackAlert.className = 'alert alert-success';
        feedbackText.textContent = '✓ Correct! ' + question.explanation;
        correctAnswerContainer.classList.add('d-none');
        
        // Highlight correct option if multiple choice
        if (question.type === 'multiple') {
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.textContent === question.answer) {
                    btn.classList.add('correct');
                }
            });
        }
    } else {
        feedbackAlert.className = 'alert alert-danger';
        feedbackText.textContent = '✗ Incorrect. ' + question.explanation;
        correctAnswerContainer.classList.remove('d-none');
        correctAnswer.textContent = question.answer;
        
        // Highlight incorrect and correct options if multiple choice
        if (question.type === 'multiple') {
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.classList.contains('selected')) {
                    btn.classList.add('incorrect');
                }
                if (btn.textContent === question.answer) {
                    btn.classList.add('correct');
                }
            });
        }
    }
}

// Load the next question
function loadNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

// Show final results
function showResults() {
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    finalScore.textContent = score;
    
    // Calculate percentage score
    const percentage = (score / quizData.length) * 100;
    
    // Set appropriate message based on score
    let message = '';
    if (percentage === 100) {
        message = "Perfect score! You're a true Cristiano Ronaldo superfan!";
        resultIcon.innerHTML = '<img src="https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Trophy.png" alt="World Cup Trophy" class="result-trophy" style="width: 80px; height: 80px;">';
    } else if (percentage >= 80) {
        message = "Excellent! You really know your Ronaldo facts!";
        resultIcon.innerHTML = '<i class="fas fa-trophy result-trophy" style="color: gold;"></i>';
    } else if (percentage >= 60) {
        message = "Good job! You know quite a bit about CR7!";
        resultIcon.innerHTML = '<i class="fas fa-medal result-trophy" style="color: silver;"></i>';
    } else if (percentage >= 40) {
        message = "Not bad! But there's more to learn about Ronaldo.";
        resultIcon.innerHTML = '<i class="fas fa-medal result-trophy" style="color: #cd7f32;"></i>';
    } else {
        message = "Time to brush up on your Ronaldo knowledge!";
        resultIcon.innerHTML = '<i class="fas fa-futbol result-trophy" style="color: #ffffff;"></i>';
    }
    
    resultMessage.textContent = message;
    
    // Update progress bar to show completion
    progressBar.style.width = '100%';
}

// Restart the quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    progressBar.style.width = '0%';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initQuiz);