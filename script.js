document.addEventListener('DOMContentLoaded', function() {
    let questions = [];
    let selectedAnswers = [];
    let currentQuestion = 0;
    let timeLeft = 15;
    let timerInterval;
    let userName = ""; // Variable to store the user's name

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                startQuiz();
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    function loadQuestion(questionIndex) {
        const questionData = questions[questionIndex];
        document.getElementById('question').textContent = questionData.question;
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';

        const shuffledOptions = [...questionData.options];
        shuffleArray(shuffledOptions);

        shuffledOptions.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(optionDiv, questionIndex));
            optionsDiv.appendChild(optionDiv);
        });

        document.getElementById('current-question').textContent = questionIndex + 1;
        document.getElementById('total-questions').textContent = questions.length;
    }

    function startTimer() {
        timeLeft = 15;
        document.getElementById('time-left').textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('time-left').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                nextQuestion();
            }
        }, 2000);
    }

    function selectOption(optionDiv, questionIndex) {
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        optionDiv.classList.add('selected');
        selectedAnswers[questionIndex] = optionDiv.textContent;
        clearInterval(timerInterval);
        startTimer();
    }

    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion(currentQuestion);
            document.getElementById('prev-btn').disabled = false;
            if (selectedAnswers[currentQuestion]) {
                const options = document.querySelectorAll('.option');
                options.forEach(opt => {
                    if (opt.textContent === selectedAnswers[currentQuestion]) {
                        opt.classList.add('selected');
                    }
                });
            }
            clearInterval(timerInterval);
            startTimer();
        } else {
            endQuiz();
        }
        if (currentQuestion === questions.length - 1) {
            document.getElementById('next-btn').disabled = true;
        }
    }

    function prevQuestion() {
        currentQuestion--;
        if (currentQuestion >= 0) {
            loadQuestion(currentQuestion);
            document.getElementById('next-btn').disabled = false;
            if (selectedAnswers[currentQuestion]) {
                const options = document.querySelectorAll('.option');
                options.forEach(opt => {
                    if (opt.textContent === selectedAnswers[currentQuestion]) {
                        opt.classList.add('selected');
                    }
                });
            }
            startTimer();
        }
        if (currentQuestion === 0) {
            document.getElementById('prev-btn').disabled = true;
        }
    }

    function startQuiz() {
        const startScreen = document.getElementsByClassName('start-screen')[0];
        startScreen.style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        currentQuestion = 0;
        selectedAnswers = [];
        shuffleArray(questions);
        loadQuestion(currentQuestion);
        startTimer();
    }

    function endQuiz() {
        clearInterval(timerInterval);
        document.getElementById('quiz-screen').style.display = 'none';
        const endScreen = document.getElementById('end-screen');
        endScreen.style.display = 'block';

        let score = 0;
        let resultsHTML = `<h2>Test Finished, ${userName}!</h2>`; // Include the user's name

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userAnswer = selectedAnswers[i];
            const correctAnswer = question.answer;

            resultsHTML += `<p>${question.question}<br>`;

            if (userAnswer === correctAnswer) {
                resultsHTML += `<span style="color: green;">Your Answer: ${userAnswer} <span style="font-size:20px;">&#10004;</span></span></p>`;
                score++;
            } else {
                resultsHTML += `<span style="color: red;">Your Answer: ${userAnswer || "Not Answered"} <span style="font-size:20px;">&#10008;</span></span><br>`;
                resultsHTML += `<span style="color: green;">Correct Answer: ${correctAnswer}</span></p>`;
            }
        }

        resultsHTML += `<p>You scored ${score} out of ${questions.length}.</p><button id="end-btn">End Test</button>`;
        endScreen.innerHTML = resultsHTML;

        document.getElementById('end-btn').addEventListener('click', () => {
            endScreen.innerHTML = `<h2>Thank You, ${userName}!</h2><p>Thank you for taking the test.</p><button id="start-again-btn">Start Again</button>`; // Include the user's name

            document.getElementById('start-again-btn').addEventListener('click', () => {
                endScreen.style.display = 'none';
                document.getElementsByClassName('start-screen')[0].style.display = 'flex';
                currentQuestion = 0;
                selectedAnswers = [];
                loadQuestions();
            });
        });
    }

    document.getElementById('start-btn').addEventListener('click', () => {
        userName = document.getElementById('name-input').value; // Get the user's name
        if (userName.trim() === "") {
            alert("Please enter your name.");
            return;
        }
        loadQuestions();
    });
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
});
