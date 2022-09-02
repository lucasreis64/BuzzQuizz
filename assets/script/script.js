let containerQuizzes = document.querySelector('.container-quizzes');
let addButtom = document.querySelector('.quizzes-user button');
let content = document.querySelector('.content');
const main = document.querySelector('.main');
let perguntasQuizz, niveisQuizz, quizzUser = [];
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
    quizzMakerOne();
}

//renderiza página 1
function quizzMakerOne() {
    content.innerHTML = `
    <div class="quizz-maker-container">
        <div class="quizz-maker1">
            <h2>Comece pelo começo</h2>
            <form action="#" onsubmit="setTimeout(quizzMakerTwo,100)">
                <div class="info">
                    <input type="text" placeholder="Título do seu quizz" oninput="setCustomValidity('');"
                        maxlength="65" pattern=".{20,}" required
                        oninvalid="this.setCustomValidity('Insira entre 20 e 65 caracteres!');">
                    <input type="url" placeholder="URL da imagem do seu quizz" oninput="setCustomValidity('');"
                        required oninvalid="this.setCustomValidity('Formato inválido');">
                    <input type="number" placeholder="Quantidade de perguntas do quizz"
                        oninput="setCustomValidity('');" min="3" required
                        oninvalid="this.setCustomValidity('Valor mínimo= 3, apenas números inteiros.');">
                    <input type="number" placeholder="Quantidade de níveis do quizz"
                        oninput="setCustomValidity('');" min="2" required
                        oninvalid="this.setCustomValidity('Valor mínimo= 2, apenas números inteiros.');">
                </div>
                <input type="submit" value="Prosseguir para criar perguntas">
            </form>
    </div>`
}

//renderiza página 2
function quizzMakerTwo() {
    quizzUser.title = document.querySelector('.info input:first-child').value;
    quizzUser.image = document.querySelector('.info input:nth-child(2)').value;
    questionsQuizz = document.querySelector('.info input:nth-child(3)').value;
    levelsQuizz = document.querySelector('.info input:nth-child(4)').value;
    eraseContent(content);

    const questionStructure = `
    <div class="quizz-maker-container">
            <div class="quizz-maker2">
                <h2>Crie suas perguntas</h2>
                <form action="#" onsubmit="setTimeout(quizzMakerThree,100)">
                </form>
            </div>
    </div>
    `

    content.innerHTML = questionStructure;
    const form = document.querySelector('.quizz-maker2 form');

    for (let cont = 0; cont < questionsQuizz; cont++) {
        const questionNumber = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.innerText = `Pergunta ${cont+1}`;
        const img = document.createElement('img');
        img.src = `./assets/images/Vector.svg`;
        questionNumber.classList.add('question-number');
        questionNumber.appendChild(h3);
        questionNumber.appendChild(img);
        addHTML(questionNumber);
        form.appendChild(questionNumber);
        if (cont == 0) {
            rewriteQuestionDivCopy(questionNumber);
        } else {
            img.addEventListener('click', rewriteQuestionDiv);
        }
    }
    const input = document.createElement('button');
    input.innerHTML = 'Prosseguir para criar níveis'
    form.appendChild(input);
    input.addEventListener('click', hiddenChecker);
}

function addAnotherAnswer() {
    const buttonCopy = this;
    const parent = this.parentNode;
    const answersArray = parent.querySelectorAll('.answer');
    this.remove();
    const inputAnswer = document.createElement('input');
    const inputImage = document.createElement('input');

    inputAnswer.classList.add('answer');
    inputAnswer.setAttribute("type", "text");
    inputAnswer.setAttribute("oninput", "setCustomValidity('');");
    inputAnswer.setAttribute("placeholder", `Resposta incorreta ${answersArray.length}`);
    inputAnswer.setAttribute("oninvalid", "this.setCustomValidity('Formato inválido')");

    inputImage.classList.add('image');
    inputImage.setAttribute("type", "text");
    inputImage.setAttribute("oninput", "setCustomValidity('');");
    inputImage.setAttribute("placeholder", `Resposta incorreta ${answersArray.length}`);
    inputImage.setAttribute("oninvalid", "this.setCustomValidity('Formato inválido')");

    /*     const incorrectAnswerElement = `
        <input class = "answer" type="text" placeholder="Resposta incorreta ${answersArray.length}" oninput="setCustomValidity('');" required
        oninvalid="this.setCustomValidity('Texto não pode estar vazio!')">
        <input class = "image" type="url" placeholder="URL da imagem ${answersArray.length}" oninput="setCustomValidity('');" required
        oninvalid="this.setCustomValidity('Formato inválido')">` */

    parent.appendChild(inputAnswer);
    parent.appendChild(inputImage);
    parent.appendChild(buttonCopy);

    if (answersArray.length === 4) {
        this.remove();
    }
}

function hiddenChecker() {
    if (document.querySelector('.hidden') !== null) {
        alert('Clique nas outras perguntas para prosseguir!');
    }
}

//adiciona elementos HTML à div da pergunta
function addHTML(param) {
    const h3 = param.querySelector('h3').innerText;
    const infoHidden = document.createElement('div');
    infoHidden.classList.add('info', 'hidden');
    infoHidden.innerHTML += `
        <h3>${h3}</h3>
        <input type="text" placeholder="Texto da pergunta" oninput="setCustomValidity('');"
            pattern=".{20,}" required
            oninvalid="this.setCustomValidity('Insira no mínimo 20 caracteres!')">
        <input type="text" placeholder="Cor de fundo da pergunta" pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" oninput="setCustomValidity('');"
            required oninvalid="this.setCustomValidity('Formato inválido')">

        <h3>Resposta correta</h3>
        <input type="text" class="answer" placeholder="Resposta correta" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Texto não pode estar vazio')">

        <input type="url" class="image" placeholder="URL da imagem" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Formato inválido')">

        <h3>Respostas incorretas</h3>
        <input type="text" class="answer" placeholder="Resposta incorreta 1" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Texto não pode estar vazio!')">
        <input type="url" class="image" placeholder="URL da imagem 1" oninput="setCustomValidity('');" required
            oninvalid="this.setCustomValidity('Formato inválido')">`
    param.appendChild(infoHidden);
    const addAnswerButton = document.createElement('div');
    addAnswerButton.innerHTML = 'Adicione uma nova resposta';
    addAnswerButton.classList.add('add-answer')
    infoHidden.appendChild(addAnswerButton);
    addAnswerButton.addEventListener('click', addAnotherAnswer);
}

//reescreve a div da pergunta
function rewriteQuestionDiv() {
    const box = this.parentNode;
    console.log(box.querySelector('.hidden'));
    const information = box.querySelector('.hidden');
    box.removeChild(box.firstElementChild);
    box.removeChild(box.firstElementChild);
    box.classList.remove('question-number');
    information.classList.remove('hidden');
}
//faz a msm coisa que a original
function rewriteQuestionDivCopy(esse) {
    const box = esse.parentNode;
    console.log(esse.querySelector('.hidden'));
    const information = esse.querySelector('.hidden');
    esse.removeChild(esse.firstElementChild);
    esse.removeChild(esse.firstElementChild);
    esse.classList.remove('question-number');
    information.classList.remove('hidden');
}

function getValues() {
    let infoArray = document.querySelectorAll('.info');
    quizzUser.questions = [{
        title: '',
        color: '',
        answers: [{
            text: '',
            image: '',
            isCorrectAnswer: true
        }]
    }];
    let answersArray, imagesArray, inputArray;
    for (let cont = 0; cont < questionsQuizz; cont++) {
        const disgusting = infoArray[cont];
        console.log('okok0');

        answersArray = disgusting.querySelectorAll('.answer');
        console.log('okok1');
        imagesArray = disgusting.querySelectorAll('.image');
        console.log('okok2');
        inputArray = disgusting.querySelectorAll('input');

        console.log('inputArray[0]', inputArray[0].value);
        quizzUser.questions[cont].title = inputArray[0].value;
        quizzUser.questions[cont].color = inputArray[1].value;

        for (let cont1 = 0; cont1 < answersArray.length; cont1++) {
            if (cont1 > 0) {
                quizzUser.questions[cont].answers[cont1].isCorrectAnswer = false;
            }
            quizzUser.questions[cont].answers[cont1].text = answersArray[cont1].value;
            quizzUser.questions[cont].answers[cont1].image = imagesArray[cont1].value;

            if (cont1 < answersArray.length - 1) {
                quizzUser.questions[cont].answers.push([{
                    text: '',
                    image: ''
                }]);
            }
        }
        if (cont < questionsQuizz - 1) {
            quizzUser.questions[cont + 1] = {
                answers: [{
                    text: '',
                    image: '',
                    isCorrectAnswer: true
                }]
            };
        }
    }

}

//renderiza página 3 do quizz
function quizzMakerThree() {
    getValues();
    console.log('Hello, World');
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
    answers, //variavel para todas perguntas 
    contScroll,
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
        openedQuizzShowQuestions(question, backgroundQuestion, child) //função criar perguntas quizz
        openedQuizzShowAnswers(answers, child);

    }
    contScroll = 1
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
function openedQuizzShowQuestions(question, backgroundQuestion, child) {
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
function openedQuizzShowAnswers(answers, child) {
    let answersDiv = document.querySelector(`.question-container:nth-child(${child}) .answers`);
    answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answers.length; i++) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.classList.add('matte');
        answerDiv.classList.add(`${answers[i].isCorrectAnswer}`)

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

function playQuizz() {
    //ao clicar na resposta será referente a pergunta 
    console.log(this)
    this.classList.remove("matte")
    this.classList.add("clicked")

    // ao clicar em um elemento answer todos ficar foscos menos o elemento clicado
    const quest = this.parentNode; // questão que o usuário clicou
    console.log("questão", quest)

    const matte = quest.querySelectorAll(` .matte`);
    console.log("elementos matte", matte)
    console.log("child", child)

    matte.forEach((matte) => matte.style.opacity = "0.3");

    const correct = quest.querySelectorAll(`.true p`);
    correct.forEach((correct) => correct.style.color = "#009C22")

    const incorrect = quest.querySelectorAll(`.false p`);
    incorrect.forEach((incorrect) => incorrect.style.color = "#FF4B4B")

    if (this.classList.contains("true")) {
        correctAnswer++;
    }


    console.log("corretas", correctAnswer)
    if (this.classList.contains("clicked") == true) {
        contScroll++;
    }
    setTimeout(scrollNextQuestion, 2000);

}

function scrollNextQuestion() {
    let scrollToQuestion = document.querySelector(`.number${contScroll}`)
    console.log("scrolllll", scrollToQuestion)
    if (contScroll > 1 && contScroll <= questions.length) {
        scrollToQuestion.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }
    // é preciso zerar o contScroll depois para outros quizzes
}