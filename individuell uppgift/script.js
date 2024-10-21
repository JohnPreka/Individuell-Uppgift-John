const questions = {
    
    ämne1: [
        { question: "Vad är 2 + 2?", options: ["3", "4", "5"], answer: "4" },
        { question: "Vilken färg har himlen?", options: ["Blå", "Grön", "Röd"], answer: "Blå" },
        { question: "Vad är huvudstaden i Sverige?", options: ["Göteborg", "Stockholm", "Malmö"], answer: "Stockholm" },
        { question: "Hur många dagar finns det på ett år?", options: ["365", "366", "364"], answer: "365" },
        { question: "Vad är 5 x 5?", options: ["20", "25", "30"], answer: "25" }
    ],
    ämne2: [
        { question: "Vilket år började andra världskriget?", options: ["1914", "1939", "1945"], answer: "1939" },
        { question: "Vem skrev 'Hamlet'?", options: ["Goethe", "Shakespeare", "Tolstoy"], answer: "Shakespeare" },
        { question: "Vad heter planeten närmast solen?", options: ["Venus", "Merkurius", "Mars"], answer: "Merkurius" },
        { question: "Vilket land vann fotbolls-VM 2018?", options: ["Tyskland", "Frankrike", "Brasilien"], answer: "Frankrike" },
        { question: "Hur många kontinenter finns det?", options: ["5", "6", "7"], answer: "7" }
    ]
};

let currentSubject = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let userName = ""; 
let quizTimer; 
let totalTimeLeft = 60; 

function startQuiz(subject) {
    const nameInput = document.getElementById('user-name').value.trim();

    if (nameInput === "") {
        document.getElementById('name-warning').style.display = 'block';
        return;
    }

    userName = nameInput;
    document.getElementById('name-warning').style.display = 'none';

    currentSubject = subject;
    currentQuestions = questions[subject].sort(() => 0.5 - Math.random()).slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;
    totalTimeLeft = 60; 
    showPage('quiz-page');
    showQuestion();
    startQuizTimer(); 
}

function showQuestion() {
    const questionObj = currentQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = questionObj.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    questionObj.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    document.getElementById('feedback').textContent = '';
    startTimer();
}

function checkAnswer(selectedOption) {
    const correctAnswer = currentQuestions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        score++;
        document.getElementById('feedback').textContent = 'Rätt!';
        document.getElementById('feedback').style.color = 'green';
    } else {
        document.getElementById('feedback').textContent = 'Fel!';
        document.getElementById('feedback').style.color = 'red';
    }

    Array.from(document.getElementById('options').children).forEach(button => {
        button.disabled = true;
    });

    stopTimer();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    stopQuizTimer(); 
    showPage('result-page');
    document.getElementById('score').textContent = `Din poäng är: ${score} av ${currentQuestions.length}`;
    document.getElementById('user-result-name').textContent = `Bra jobbat, ${userName}!`; // Visa användarnamnet
    
    const highScore = Math.max(score, localStorage.getItem('highScore') || 0);
    localStorage.setItem('highScore', highScore);
    document.getElementById('high-score').textContent = highScore;

    updateScoreboard(score);
}

function resetQuiz() {
    showPage('start-page');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function startTimer() {
    timeLeft = 10;
    document.getElementById('time-left').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); 
        }
    }, 1000);
}

function startQuizTimer() {
    const timerElement = document.getElementById('quiz-timer');
    timerElement.textContent = `Tid kvar för quiz: ${totalTimeLeft} sekunder`;

    quizTimer = setInterval(() => {
        totalTimeLeft--;
        timerElement.textContent = `Tid kvar för quiz: ${totalTimeLeft} sekunder`;

        if (totalTimeLeft <= 0) {
            clearInterval(quizTimer);
            alert('Tiden är slut! Quizzen avslutas.');
            showResult();
        }
    }, 1000);
}

function stopQuizTimer() {
    clearInterval(quizTimer);
}

function stopTimer() {
    clearInterval(timer);
}

function updateScoreboard(currentScore) {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];

    scoreboard.unshift({ name: userName, score: currentScore });

    if (scoreboard.length > 5) {
        scoreboard = scoreboard.slice(0, 5);
    }

    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));

    const scoreboardDiv = document.getElementById('scoreboard');
    scoreboardDiv.innerHTML = '<h3>Senaste Resultat</h3>';
    scoreboard.forEach((result, index) => {
        const resultItem = document.createElement('p');
        resultItem.textContent = `${index + 1}. ${result.name}: ${result.score} poäng`;
        scoreboardDiv.appendChild(resultItem);
    });
}

window.onload = () => {
    showPage('start-page');
};
