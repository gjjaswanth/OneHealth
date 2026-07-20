let questions = [...quizData];

// Shuffle questions
questions = shuffleArray(questions);

// Shuffle options while preserving answer
questions.forEach(q => {
    const ans = q.a;
    q.o = shuffleArray(q.o);
    q.a = ans;
});

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let timer = 60 * 60; // 60 minutes

const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const progressBar = document.getElementById("progressBar");
const counter = document.getElementById("counter");
const timerDisplay = document.getElementById("timer");

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function loadQuestion() {

    const q = questions[currentQuestion];

    questionBox.innerHTML =
        `${currentQuestion + 1}. ${q.q}`;

    optionsBox.innerHTML = "";

    q.o.forEach(option => {

        const checked =
            userAnswers[currentQuestion] === option
                ? "checked"
                : "";

        optionsBox.innerHTML += `

<label class="option">

<input
type="radio"
name="answer"
value="${option}"
${checked}
>

<span>${option}</span>

</label>

`;

    });

    counter.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    progressBar.style.width =
        ((currentQuestion + 1) / questions.length) * 100 + "%";

    document
        .querySelectorAll("input[name='answer']")
        .forEach(radio => {

            radio.addEventListener("change", function () {

                userAnswers[currentQuestion] = this.value;

            });

        });

    document.getElementById("prevBtn").disabled =
        currentQuestion === 0;

    document.getElementById("nextBtn").disabled =
        currentQuestion === questions.length - 1;

}

document.getElementById("nextBtn").addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

});

document.getElementById("prevBtn").addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

});

document.getElementById("submitBtn").addEventListener("click", () => {

    if (confirm("Submit the quiz?")) {

        submitQuiz();

    }

});

function submitQuiz() {

    let score = 0;

    let review = "";

    questions.forEach((q, i) => {

        const selected = userAnswers[i];

        if (selected === q.a)
            score++;

        review += `

<div class="review">

<h3>Question ${i + 1}</h3>

<p>${q.q}</p>

<p>
<b>Your Answer:</b>
${selected ?? "Not Answered"}
</p>

<p>
<b>Correct Answer:</b>

<span class="correct">
${q.a}
</span>

</p>

<hr>

</div>

`;

    });

    document.getElementById("quizArea").style.display = "none";

    document.getElementById("result").innerHTML = `

<h1>

Score : ${score} / ${questions.length}

</h1>

${review}

`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function updateTimer() {

    const min = Math.floor(timer / 60);

    const sec = timer % 60;

    timerDisplay.textContent =
        `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    if (timer <= 0) {

        clearInterval(timerInterval);

        alert("Time Up!");

        submitQuiz();

        return;

    }

    timer--;

}

const timerInterval = setInterval(updateTimer, 1000);

loadQuestion();

updateTimer();
