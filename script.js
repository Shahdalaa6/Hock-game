const questions = [
    { text: "Coffee was discovered by accident.", correct: true },
    { text: "The human brain stops developing at age 18.", correct: false },
    { text: "Drinking water can improve concentration.", correct: true },
    { text: "Multitasking increases productivity.", correct: false },
    { text: "Bananas are berries.", correct: true },
    { text: "Goldfish have a memory of only three seconds.", correct: false },
    { text: "The Great Wall of China is visible from space.", correct: false },
    { text: "Octopuses have three hearts.", correct: true },
    { text: "Sharks existed before trees.", correct: true },
    { text: "Adults have more bones than babies.", correct: false },
    { text: "An ostrich’s eye is bigger than its brain.", correct: true },
    { text: "A day on Venus is longer than a year on Venus.", correct: true }
];


const socket = io();

let currentQuestion = 0;
let players = [];
let currentPlayerName = "";

// Listen for player list updates from server
socket.on('updatePlayers', (updatedPlayers) => {
    players = updatedPlayers;
    updatePlayersList();
});

// Listen when other players answer
socket.on('playerAnswered', (data) => {
    console.log(`${data.playerName} answered question ${data.question}: ${data.answer}`);
});

// Listen when other players progress
socket.on('playerProgressed', (data) => {
    console.log(`${data.playerName} is on question ${data.questionIndex}`);
});

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
}

function startGame() {
    const nameInput = document.getElementById("playerName");
    const name = nameInput.value.trim();

    if (name === "") return;

    currentPlayerName = name;
    // Notify server that a player joined
    socket.emit('playerJoin', name);
    showScreen("playersScreen");
}

function updatePlayersList() {
    const list = document.getElementById("playersList");
    list.innerHTML = "";

    players.forEach(player => {
        const li = document.createElement("li");
        li.innerText = player.name;
        list.appendChild(li);
    });

    const continueBtn = document.getElementById("continueBtn");

    if (players.length >= 3) {
        continueBtn.disabled = false;
        continueBtn.innerText = "Start Game";
    } else {
        continueBtn.disabled = true;
        continueBtn.innerText = "Waiting for at least 3 players...";
    }
}


function goToGame() {
    currentQuestion = 0;
    loadQuestion();
    showScreen("gameScreen");
}

function loadQuestion() {
    document.getElementById("question").innerText =
        questions[currentQuestion].text;

    document.querySelectorAll(".choice").forEach(btn => {
        btn.classList.remove("selected");
        btn.style.display = "block";
    });

    document.getElementById("nextBtn").style.display = "block";
}

function selectAnswer(answer) {
    const buttons = document.querySelectorAll(".choice");
    buttons.forEach(btn => btn.classList.remove("selected"));

    if (answer) {
        buttons[0].classList.add("selected");
    } else {
        buttons[1].classList.add("selected");
    }

    // Notify server of the answer
    socket.emit('answerQuestion', {
        playerName: currentPlayerName,
        questionIndex: currentQuestion,
        answer: answer
    });
}

function nextQuestion() {
    currentQuestion++;

    // Notify server of progress
    socket.emit('nextQuestion', {
        playerName: currentPlayerName,
        questionIndex: currentQuestion
    });

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        document.getElementById("question").innerText = "Game completed.";

        document.querySelectorAll(".choice").forEach(btn => {
            btn.style.display = "none";
        });

        document.getElementById("nextBtn").style.display = "none";
    }
}

