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

/* ---------------- SOCKET LISTENERS ---------------- */

socket.on("updatePlayers", (updatedPlayers) => {
    players = updatedPlayers;
    updatePlayersList();
});

socket.on("playerAnswered", (data) => {
    console.log(`${data.playerName} answered Q${data.questionIndex}`);
});

socket.on("playerProgressed", (data) => {
    console.log(`${data.playerName} moved to Q${data.questionIndex}`);
});

/* ---------------- UI FUNCTIONS ---------------- */

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* ---------------- JOIN GAME ---------------- */

function startGame() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();

    if (!name) return;

    currentPlayerName = name;
    socket.emit("playerJoin", name);

    input.value = "";
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
}

/* ---------------- GAME LOGIC ---------------- */

function goToGame() {
    currentQuestion = 0;
    loadQuestion();
    showScreen("gameScreen");
}

function loadQuestion() {
    document.getElementById("question").innerText =
        questions[currentQuestion].text;

    document.getElementById("feedback").innerText = "";

    document.querySelectorAll(".choice").forEach(btn => {
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
        btn.style.display = "block";
    });

    // ❗ Hide Next until answer chosen
    document.getElementById("nextBtn").style.display = "none";
}

/* ---------------- ANSWERING ---------------- */

function selectAnswer(answer) {
    const correct = questions[currentQuestion].correct;
    const buttons = document.querySelectorAll(".choice");


    if (answer === correct) {
        answer ? buttons[0].classList.add("correct") : buttons[1].classList.add("correct");
        document.getElementById("feedback").innerText = "Correct!";
    } else {
        answer ? buttons[0].classList.add("wrong") : buttons[1].classList.add("wrong");
        correct ? buttons[0].classList.add("correct") : buttons[1].classList.add("correct");
        document.getElementById("feedback").innerText = "Wrong!";
    }

    socket.emit("answerQuestion", {
        playerName: currentPlayerName,
        questionIndex: currentQuestion,
        answer
    });

    // ✅ Show Next button ONLY after answering
    document.getElementById("nextBtn").style.display = "block";
}

/* ---------------- NEXT QUESTION ---------------- */

function nextQuestion() {
    currentQuestion++;

    socket.emit("nextQuestion", {
        playerName: currentPlayerName,
        questionIndex: currentQuestion
    });

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

/* ---------------- END GAME ---------------- */

function endGame() {
    document.getElementById("question").innerText = "Game completed 🎉";

    document.querySelectorAll(".choice").forEach(btn => btn.style.display = "none");
    document.getElementById("nextBtn").style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
    showScreen("introScreen");
});
