let containerQuizzes = document.querySelector('.container-quizzes');
let addButtom = document.querySelector('.quizzes-user button');
let content = document.querySelector('.content');
const main = document.querySelector('.main');

const mainCopy = main.innerHTML;
const quizzesurl = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let image, text, id, message;


quizzGet();


//Pega as informações sobre os quizzes na API
function quizzGet() {

    containerQuizzes = document.querySelector('.container-quizzes')

    containerQuizzes = document.querySelector('.container-quizzes');
    addButtom = document.querySelector('.quizzes-user button');

    const promise = axios.get(quizzesurl);
    promise.then(renderQuizzInfo);
    promise.catch();

    addButtom.addEventListener("click", quizzMaker);
}

//renderiza o quiz na tela principal;
function renderQuizzInfo(message) {
    msg = message.data;
    console.log(msg);

    for (let cont = 0; cont < msg.length; cont++) {
        image = msg[cont].image;
        text = msg[cont].title;
        id = msg[cont].id;
        quizzShow(image, text, id);
    }
}

//cria a div que mostra o quiz na tela principal;
function quizzShow(image, text, id) {
    const quizz = document.createElement('div');
    quizz.classList.add('quizz-show');
    quizz.id = id;

    const img = document.createElement('img');
    img.src = image;

    const gradient = document.createElement('div');
    gradient.classList.add('gradient');

    const p = document.createElement('p');
    p.innerText = text;

    quizz.appendChild(img);
    quizz.appendChild(gradient);
    quizz.appendChild(p);

    containerQuizzes.appendChild(quizz);
    quizz.addEventListener('click', quizzDataGet);

}

//apaga o html do elemento escolhido pelo parametro passado;
function eraseContent(main) {
    main.innerHTML = '';
}

//renderiza a página principal novamente (reiniciando);
function renderMainContent() {
    main.innerHTML = mainCopy;
    quizzGet();
}

//inicia a criação do quizz;
function quizzMaker() {
    eraseContent(main);
    content = document.querySelector('.content');


}

// ------------------------ QUIZZ SELECIONADO --------------------------
//pega as informações do quizz especifico;
function quizzDataGet() {
    const quizzId = this.id;
    const promise = axios.get(`${quizzesurl}/${quizzId}`);
    promise.then(quizzOpening);
}

let cover,
    title,
    questions,
    question,
    backgroundQuestion,
    answers,
    answer,
    answerImg,
    correctAnswer,
    child = 0;
//renderiza a página do quizz;
function quizzOpening(message) {
    eraseContent(main);
    message = message.data;
    cover = message.image;
    title = message.title;
    questions = message.questions;
    
    //answers = questions.answers;
    openedQuizzShowCover(cover, title); // função criar a capa do quizz
     for (let i = 0; i < questions.length; i++) {
        answers = questions[i].answers; 
        question = questions[i].title;
        backgroundQuestion = questions[i].color;
        child++;
        openedQuizzShowQuestions(question, backgroundQuestion) //função criar perguntas quizz
    
        openedQuizzShowAnswers(answers,child);
    }
}


const quizzCover = document.querySelector('.quizz-cover');
//criação da capa do quizz
function openedQuizzShowCover(cover, title) {

    const quizzCoverImg = document.createElement('img');
    quizzCoverImg.src = cover;

    const quizzTitle = document.createElement('p');
    quizzTitle.innerText = title;

    quizzCover.appendChild(quizzCoverImg);
    quizzCover.appendChild(quizzTitle);

}

const quizzQuestions = document.querySelector('.quizz-questions');
//criação das perguntas do quizz
function openedQuizzShowQuestions(question, backgroundQuestion) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');


    const questionTitle = document.createElement('p');
    questionTitle.classList.add('question')
    questionTitle.innerText = question;
    questionTitle.style.backgroundColor = backgroundQuestion;

    const answersDiv = document.createElement('div');
    answersDiv.classList.add('answers');

    questionContainer.appendChild(questionTitle);
    quizzQuestions.appendChild(questionContainer);
    questionContainer.appendChild(answersDiv);

}
//criação das respostas do quizz
function openedQuizzShowAnswers(answers,child) {
    let answersDiv= document.querySelector(`.question-container:nth-child(${child}) .answers`);
    answers.sort(()=> Math.random() - 0.5);

    for(let i=0; i<answers.length;i++){
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    answerDiv.classList.add (`${answers[i].isCorrectAnswer}`)
    /*if (answersArray[i].isCorrectAnswer === true){
        answerDiv.classList.add('true');
    }else{
        answerDiv.classList.add('false');
    }*/

    const answerImage = document.createElement('img');
    answerImage.src = answers[i].image;

    const answerP = document.createElement('p');
    answerP.innerText = answers[i].text;

    answersDiv.appendChild(answerDiv);
    answerDiv.appendChild(answerImage);
    answerDiv.appendChild(answerP);
 }
    /* const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');

    

    if (correctAnswer ===true){
        answerDiv.classList.add('true');
    }else{
        answerDiv.classList.add('false');
    }

    const answerImage = document.createElement('img');
    answerImage.src = answerImg;

    const answerP = document.createElement('p');
    answerP.innerText = answer;


    answersDiv.appendChild(answerDiv);
    answerDiv.appendChild(answerImage);
    answerDiv.appendChild(answerP);*/
}