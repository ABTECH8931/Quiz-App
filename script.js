document.addEventListener('DOMContentLoaded', function () {
    let questions = [];
    let currentQuestion = 0;
    let selectedAnswers = [];
    let timeLeft = 60;
    let timerInterval;
    let userName = "";

    // Fetch Questions from JSON File
    function loadQuestions(quizFile) {
        fetch(quizFile)
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                startQuiz();
            })
            .catch(error => {
                console.error("Error loading quiz:", error);
                alert("Failed to load quiz. Please try again.");
            });
    }

    // Start the Quiz
    function startQuiz() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        loadQuestion();
        startTimer();
    }

    // Load a Question
    function loadQuestion() {
        const questionData = questions[currentQuestion];
        document.getElementById('question').textContent = questionData.question;

        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = "";

        questionData.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(optionDiv, option));
            optionsDiv.appendChild(optionDiv);
        });

        document.getElementById('next-btn').disabled = true;
    }

    // Select an Option
    function selectOption(optionDiv, option) {
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        optionDiv.classList.add('selected');
        selectedAnswers[currentQuestion] = option;
        document.getElementById('next-btn').disabled = false;
    }

    // Start Timer
    function startTimer() {
        timeLeft = 60;
        document.getElementById('time-left').textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                nextQuestion();
            }
        }, 1000);
    }

    // Move to Next Question
    function nextQuestion() {
        clearInterval(timerInterval);

        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
            startTimer();
        } else {
            endQuiz();
        }
    }

    // End the Quiz
    function endQuiz() {
        clearInterval(timerInterval);
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('end-screen').classList.remove('hidden');

        let score = 0;
        let resultsHTML = `<h2>Results for ${userName}</h2>`;

        questions.forEach((question, index) => {
            const userAnswer = selectedAnswers[index] || "No Answer";
            const correctAnswer = question.answer;

            resultsHTML += `<p><strong>${question.question}</strong><br>`;
            if (userAnswer === correctAnswer) {
                resultsHTML += `<span style="color: green;">Your Answer: ${userAnswer} ✅</span>`;
                score++;
            } else {
                resultsHTML += `<span style="color: red;">Your Answer: ${userAnswer} ❌</span><br>`;
                resultsHTML += `<span style="color: green;">Correct Answer: ${correctAnswer}</span>`;
            }
            resultsHTML += "</p>";
        });

        resultsHTML += `<h3>Your Score: ${score} / ${questions.length}</h3>`;
        document.getElementById('results').innerHTML = resultsHTML;
    }

    // Restart the Quiz
    function restartQuiz() {
        document.getElementById('end-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        questions = [];
        currentQuestion = 0;
        selectedAnswers = [];
    }

    // Event Listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        userName = document.getElementById('user-name').value;
        const quizFile = document.getElementById('quiz-selector').value;

        if (!userName || !quizFile) {
            alert("Please enter your name and select a quiz.");
            return;
        }

        loadQuestions(quizFile);
    });

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
});
