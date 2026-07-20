let questions = [...quizData];
questions = shuffleArray(questions);

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

let timer = 60 * 60; // 60 minutes

const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const progressBar = document.getElementById("progressBar");
const counter = document.getElementById("counter");
const timerDisplay = document.getElementById("timer");

function shuffleArray(arr) {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

questions.forEach(q => {
    const correct = q.a;
    q.o = shuffleArray(q.o);
    q.a = correct;
});

function loadQuestion() {

    let q = questions[currentQuestion];

    questionBox.innerHTML =
        `<h2>${currentQuestion + 1}. ${q.q}</h2>`;

    optionsBox.innerHTML = "";

    q.o.forEach(option => {

        let checked =
            userAnswers[currentQuestion] === option
            ? "checked"
            : "";

        optionsBox.innerHTML +=

`
<label class="option">

<input
type="radio"
name="answer"
value="${option}"
${checked}
>

${option}

</label>

`;

    });

    counter.innerHTML =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    progressBar.style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    document.querySelectorAll("input[name=answer]").forEach(r => {

        r.addEventListener("change", function () {

            userAnswers[currentQuestion] = this.value;

        });

    });

}

document.getElementById("nextBtn").onclick = () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

}

document.getElementById("prevBtn").onclick = () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

}

document.getElementById("submitBtn").onclick = submitQuiz;

function submitQuiz() {

    let score = 0;

    let reviewHTML = "";

    questions.forEach((q, i) => {

        let selected = userAnswers[i];

        if (selected === q.a)
            score++;

        reviewHTML +=

`
<div class="review">

<h3>Q${i + 1}. ${q.q}</h3>

<p>

<b>Your Answer:</b>

${selected ? selected : "Not Answered"}

</p>

<p>

<b>Correct Answer:</b>

<span class="correct">

${q.a}

</span>

</p>

</div>

`;

    });

    document.getElementById("quizArea").style.display = "none";

    document.getElementById("result").innerHTML =

`

<h2>

Final Score : ${score} / ${questions.length}

</h2>

<br>

${reviewHTML}

`;

}

function updateTimer() {

    let min = Math.floor(timer / 60);

    let sec = timer % 60;

    timerDisplay.innerHTML =

`${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    if (timer <= 0) {

        submitQuiz();

        return;

    }

    timer--;

}

setInterval(updateTimer, 1000);

loadQuestion();
updateTimer();
