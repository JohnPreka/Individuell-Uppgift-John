// Frågor för olika ämnen
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
let userName = ""; // Variabel för att lagra användarnamnet
let quizTimer; 
let totalTimeLeft = 60; 

// Startar quizzen och validerar användarnamn
function startQuiz(subject) {
    const nameInput = document.getElementById('user-name').value.trim();

    if (nameInput === "") {
        // Visa varningsmeddelande om namnet är tomt
        document.getElementById('name-warning').style.display = 'block';
        return;
    }

    // Sätt användarnamnet och göm varningsmeddelandet
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

// Visar frågan och startar timern
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

// Kontrollerar svaret och ger feedback
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

    // Inaktivera alla svarsknappar efter att ett svar har valts
    Array.from(document.getElementById('options').children).forEach(button => {
        button.disabled = true;
    });

    stopTimer();
}

// Visar nästa fråga eller resultat
function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

// Visar resultat och uppdaterar high score
function showResult() {
    stopQuizTimer(); // Stoppa timern när resultatet visas
    showPage('result-page');
    document.getElementById('score').textContent = `Din poäng är: ${score} av ${currentQuestions.length}`;
    document.getElementById('user-result-name').textContent = `Bra jobbat, ${userName}!`; // Visa användarnamnet
    
    // Uppdatera och visa högsta poäng
    const highScore = Math.max(score, localStorage.getItem('highScore') || 0);
    localStorage.setItem('highScore', highScore);
    document.getElementById('high-score').textContent = highScore;

    // Uppdatera scoreboard
    updateScoreboard(score);
}

// Återställer quizzen till startsidan
function resetQuiz() {
    showPage('start-page');
}

// Visar den aktiva sidan
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Startar nedräkningstimer för varje fråga
function startTimer() {
    timeLeft = 10;
    document.getElementById('time-left').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); // Räknas som fel svar
        }
    }, 1000);
}

// Startar timern för hela quizzen
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

// Stoppar quiz-timern
function stopQuizTimer() {
    clearInterval(quizTimer);
}

// Stoppar frågetimern
function stopTimer() {
    clearInterval(timer);
}

// Uppdaterar scoreboard med användarens resultat
function updateScoreboard(currentScore) {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];

    // Lägg till det nya resultatet till början av listan
    scoreboard.unshift({ name: userName, score: currentScore });

    // Begränsa listan till de senaste 5 resultaten
    if (scoreboard.length > 5) {
        scoreboard = scoreboard.slice(0, 5);
    }

    // Spara den uppdaterade scoreboarden i localStorage
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));

    // Visa scoreboard på resultatsidan
    const scoreboardDiv = document.getElementById('scoreboard');
    scoreboardDiv.innerHTML = '<h3>Senaste Resultat</h3>';
    scoreboard.forEach((result, index) => {
        const resultItem = document.createElement('p');
        resultItem.textContent = `${index + 1}. ${result.name}: ${result.score} poäng`;
        scoreboardDiv.appendChild(resultItem);
    });
}

// Laddar startsidan när sidan öppnas
window.onload = () => {
    showPage('start-page');
};
