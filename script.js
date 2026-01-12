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

let currentQuestion = 0;
let score = 0;
let currentPlayerName = "";

/* ---------------- SCREENS ---------------- */

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* ---------------- START ---------------- */

function startGame() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();

    if (!name) return;

    currentPlayerName = name;
    score = 0;
    currentQuestion = 0;

    showScreen("gameScreen");
    loadQuestion();
}

/* ---------------- QUESTIONS ---------------- */

function loadQuestion() {
    document.getElementById("question").innerText =
        questions[currentQuestion].text;

    const buttons = document.querySelectorAll(".choice");
    buttons[0].innerText = "True";
    buttons[1].innerText = "False";

    buttons.forEach(btn => {
        btn.classList.remove("correct", "wrong", "selected"); // ✅ clear old styles
        btn.disabled = false;                                 // ✅ re-enable
        btn.style.display = "block";                          // ✅ make visible
    });

    document.getElementById("nextBtn").style.display = "none";
}



/* ---------------- ANSWER ---------------- */

function selectAnswer(answer) {
    const buttons = document.querySelectorAll(".choice");

    buttons.forEach(btn => btn.classList.remove("selected"));
    answer ? buttons[0].classList.add("selected") : buttons[1].classList.add("selected");

    document.getElementById("nextBtn").style.display = "block";
}


/* ---------------- NEXT ---------------- */

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

/* ---------------- END ---------------- */

function endGame() {
    document.getElementById("question").innerText =
        `Game completed 🎉`;

    document.getElementById("feedback").innerText =
        `${currentPlayerName}, your score: ${score} / ${questions.length}`;

    document.querySelectorAll(".choice").forEach(btn => btn.style.display = "none");
    document.getElementById("nextBtn").style.display = "none"; // ✅ fixed
}

document.addEventListener("DOMContentLoaded", () => {
    showScreen("introScreen");
    document.getElementById("startBtn").addEventListener("click", startGame); // ✅ added
});
