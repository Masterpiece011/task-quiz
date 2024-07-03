"use strict"

const maxWidth = 1000

const allQuestions = []
let correctAnswers = []
let userAnswers = []
let activePages = []

const maxRetries = 3
let currentTry = 1

let currentResult = 0
let bestResult = 0
let countOfCorrectAnswers = 0

let currentQuestion = 0

const questions = [
    { id: 1, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4", "Ответ 5"], correct_answer: "Ответ 1" },
    { id: 2, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], correct_answer: "Ответ 3" },
    { id: 3, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4", "Ответ 5"], correct_answer: "Ответ 2" },
    { id: 4, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3"], correct_answer: "Ответ 1" },
    { id: 5, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], correct_answer: "Ответ 4" },
    { id: 6, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4", "Ответ 5"], correct_answer: "Ответ 4" },
    { id: 7, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2"], correct_answer: "Ответ 2" },
    { id: 8, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4", "Ответ 5"], correct_answer: "Ответ 2" },
    { id: 9, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], correct_answer: "Ответ 1" },
    { id: 10, question: "Вопрос?", answers: ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4", "Ответ 5"], correct_answer: "Ответ 1" },
]

const progressBarElem = document.querySelector(".js-progress-bar")
const continueBtn = document.querySelector(".js-continue-btn")

const startPage = document.querySelector(".js-quiz")

const testingPage = document.querySelector(".js-quiz-test")

const quizResults = document.querySelector(".js-quiz-results")

const questionParagraf = document.querySelector(".js-question")
const quizStartBtn = document.querySelector(".js-quiz-start-btn")
const quizAcceptBtn = document.querySelector(".js-accept-btn")
const quizRefreshBtn = document.querySelector(".js-refresh-btn")
const answersContainer = document.querySelector(".js-list-answers")

const currentDate = document.querySelector(".js-current-date")
const tryNumber = document.querySelector(".js-try-number")
const outOfResultEl = document.querySelector(".js-out-of")
const percentageResultEl = document.querySelector(".js-percentage")

const bestResultEl = document.querySelector(".js-best-result")
const bestPercentageResultEl = document.querySelector(".js-percentage-best")

const resultsMessageEl = document.querySelector(".js-results-message")

const headerTitleEl = document.querySelector(".js-header-title")

const allQuizPages = document.querySelectorAll(".js-page")

function showBestResult(tryNumber) {
    if (tryNumber > 1 && !bestPercentageResultEl.classList.contains("active")) {
        bestResultEl.classList.add("active")
    }
    if (bestResult < currentResult) {
        bestResult = currentResult
        bestPercentageResultEl.innerText = `${bestResult}%`
    }
}

function refreshQuiz() {
    quizResults.classList.remove("active")
    testingPage.classList.add("active")

    currentQuestion = 0
    userAnswers = []
    activePages = [0, 1]
    countOfCorrectAnswers = 0

    changeTitle()
    renderQuestion(currentQuestion)
    renderAnswers(currentQuestion)
    refreshProgressBar(activePages.length, allQuizPages.length, countOfCorrectAnswers, questions.length)
}

function changeTitle() {
    if (testingPage.classList.contains("active")) {
        headerTitleEl.innerText = "Заголовок"
    }
    if (quizResults.classList.contains("active")) {
        headerTitleEl.innerText = "Подготовка к отопительному сезону. Климатическая техника"
    }
}

function changeResultMessage(countOfCorrectAnswers) {
    const totalQuestions = questions.length
    let color = ""
    if (countOfCorrectAnswers <= (totalQuestions / 100) * 60) {
        resultsMessageEl.innerText = "Не очень хороший результат, рекомендуем изучить курс еще раз."
        color = "#E9262D"
    }
    if (countOfCorrectAnswers < ((totalQuestions / 100) * 90) && countOfCorrectAnswers > (totalQuestions / 100) * 60) {
        resultsMessageEl.innerText = "Уже лучше! Рекомендуем изучить курс еще раз."
        color = "#ffd43f"
    }
    if (countOfCorrectAnswers >= ((totalQuestions / 100) * 90)) {
        resultsMessageEl.innerText = "Отличный результат!"
        color = "#73BE43"
    }
    outOfResultEl.style.color = color
    percentageResultEl.style.color = color
}

function changeResultDate() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    let formattedDate = `${day}.${month}.${year}`

    currentDate.innerText = `${formattedDate}`
}

function changeResultValues() {

    for (let i = 0; i < questions.length; i++) {
        if (correctAnswers[i] == userAnswers[i]) {
            countOfCorrectAnswers += 1
        }
    }
    tryNumber.innerHTML = `${currentTry}-й`
    outOfResultEl.innerText = `${countOfCorrectAnswers}/${questions.length}`
    percentageResultEl.innerText = `${(100 / questions.length) * countOfCorrectAnswers}%`
    currentResult = (100 / questions.length) * countOfCorrectAnswers

    changeResultMessage(countOfCorrectAnswers)
}

function showResults() {
    testingPage.classList.remove("active")
    quizResults.classList.add("active")

    changeTitle()
    changeResultDate()
    changeResultValues()
    showBestResult(currentTry)

    if (currentTry == maxRetries) {
        quizRefreshBtn.classList.remove("active")
    }
}

function renderQuestion(questionNumber) {
    questionParagraf.innerText = `${questionNumber + 1}. ${questions[questionNumber].question}`
}

function renderAnswers(questionNumber) {
    answersContainer.innerHTML = ''
    let answers = questions[questionNumber].answers
    answers.forEach((item, i) => {
        let answerItem = document.createElement("li")

        answerItem.innerHTML = `
        <input id="choice${i}" type="radio" name="answer">
        <label for="choice${i}">${item}</label>
        `

        answersContainer.appendChild(answerItem)
    })
}

function saveUserAnswer() {
    const quizAnswersInputs = document.querySelectorAll(".main__quiz-answers input")
    const quizAnswersLabels = document.querySelectorAll(".main__quiz-answers label")

    const allInputs = quizAnswersInputs.length
    let noCheckedInputs = 0

    quizAnswersInputs.forEach((inputEl, i) => {
        if (inputEl.checked == true) {
            userAnswers.push(quizAnswersLabels[i].innerText)
        } else {
            noCheckedInputs += 1
        }

        if (noCheckedInputs == allInputs) {
            userAnswers.push("")
        }
    })

    if (currentQuestion < questions.length - 1) {
        currentQuestion += 1
    } else {
        showResults()
    }
}

function refreshProgressBar(countActivePages, countAllPages, result, countOfQuestions) {

    countActivePages < 3
        ? progressBarElem.style.width = countActivePages * (maxWidth / countAllPages) + "px"
        : progressBarElem.style.width = (countActivePages - 1) * (maxWidth / countAllPages) + result * ((maxWidth / countAllPages) / countOfQuestions) + "px"

    let bgColor = ""
    if (result <= (countOfQuestions / 100) * 60) {
        bgColor = "#E9262D"
    }
    if (result > (countOfQuestions / 100) * 60) {
        bgColor = "#ffd43f"
    }
    if (result >= (countOfQuestions / 100) * 90) {
        bgColor = "#73BE43"
    }
    progressBarElem.style.backgroundColor = bgColor
}

function isPageActive() {
    allQuizPages.forEach((page, pageId) => {
        if (page.classList.contains("active") && !activePages.includes(pageId)) {
            activePages.push(pageId)
        }
    })

    refreshProgressBar(activePages.length, allQuizPages.length, countOfCorrectAnswers, questions.length)
}

function initialLoad() {
    renderQuestion(currentQuestion)
    renderAnswers(currentQuestion)
    isPageActive()
}

quizStartBtn.addEventListener("click", () => {
    startPage.classList.remove("active")
    testingPage.classList.add("active")

    isPageActive()
})

quizAcceptBtn.addEventListener("click", () => {
    saveUserAnswer()
    isPageActive()
    renderQuestion(currentQuestion)
    renderAnswers(currentQuestion)
})

quizRefreshBtn.addEventListener("click", () => {
    if (currentTry < maxRetries) {
        currentTry += 1
        refreshQuiz()
        isPageActive()
    }
})

for (let item in questions) {
    correctAnswers.push(questions[item].correct_answer)
}

initialLoad()




