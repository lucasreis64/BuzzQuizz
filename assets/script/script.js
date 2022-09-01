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

//pega as informações do quizz especifico pelo ID;
function quizzDataGet() {
    const quizzId = this.id;
    const promise = axios.get(`${quizzesurl}/${quizzId}`);
    promise.then(quizzOpening); //se for sucesso abre o quizz
}

let cover, // variavel para a capa do quizz
    title, // variavel para otitulo do quizz
    questions, //variavel para todas questões do quizz
    question, // variavel para uma questão do quizz
    backgroundQuestion, // variavel para a cor da pergunta do quizz
    answers,  //variavel para todas perguntas 
    child = 0;
//renderiza a página do quizz;
function quizzOpening(message) { // ao abrir o quizz recebe o array com todas as informações do quizz
    eraseContent(main); // ao abrir o quizz apaga todo layout da pagina inicial para renderizar a nova pagina
    message = message.data; 
    cover = message.image;
    title = message.title;
    questions = message.questions;
    
    const header = document.querySelector(".header")
    header.scrollIntoView(); 
    openedQuizzShowCover(cover, title); // função criar a capa do quizz


     for (let i = 0; i < questions.length; i++) {
        answers = questions[i].answers; 
        question = questions[i].title;
        backgroundQuestion = questions[i].color;
        child++;
        openedQuizzShowQuestions(question, backgroundQuestion,child) //função criar perguntas quizz
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
function openedQuizzShowQuestions(question, backgroundQuestion,child) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    questionContainer.classList.add(`number${child}`)

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
    answerDiv.classList.add('matte');
    answerDiv.classList.add (`${answers[i].isCorrectAnswer}`)
    
    const answerImage = document.createElement('img');
    answerImage.src = answers[i].image;

    const answerP = document.createElement('p');
    answerP.innerText = answers[i].text;

    answersDiv.appendChild(answerDiv);
    answerDiv.appendChild(answerImage);
    answerDiv.appendChild(answerP);
    answerDiv.addEventListener('click', playQuizz);
 }
    
}
//------------ JOGAR O QUIZZ---------------------//
let correctAnswer = 0;
let contScroll=2;

function playQuizz (){
   //ao clicar na resposta será referente a pergunta 
    console.log(this)
    this.classList.remove("matte")
    this.classList.add("clicked")

    // ao clicar em um elemento answer todos ficar foscos menos o elemento clicado
        const quest = this.parentNode; // questão que o usuário clicou
        console.log ("quetão", quest)
    
        const matte = quest.querySelectorAll(` .matte`);
        console.log("elementos matte",matte)
        console.log("child",child)
        
        matte.forEach((matte) => matte.style.opacity = "0.3");
  
        const correct = quest.querySelectorAll(`.true p`);
        correct.forEach((correct) => correct.style.color = "#009C22")

        const incorrect = quest.querySelectorAll(`.false p`);
        incorrect .forEach((incorrect) => incorrect.style.color = "#FF4B4B")
    
        if (this.classList.contains("true")){
            correctAnswer++;
        }

setTimeout(scrollNextQuestion,2000);
    console.log("corretas",correctAnswer)
    if (this.classList.contains("clicked"==false)){
        contScroll++;
    
    }
    
}


 


function scrollNextQuestion(){
    let scrollToQuestion = document.querySelector(`.number${contScroll}`)
    console.log("scrolllll",scrollToQuestion)
    scrollToQuestion.scrollIntoView({behavior: "smooth", block: "center"})
    contScroll++;
    
}